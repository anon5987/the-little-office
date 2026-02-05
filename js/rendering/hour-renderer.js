/**
 * Hour Renderer Module
 * Dynamically builds and renders an hour from data modules
 *
 * Uses 5 functional section types:
 * - chant: Single chant with optional label
 * - chants-with-antiphon: Multiple chants wrapped by antiphon (before first, after last)
 * - chant-variants: Multiple alternative chants
 * - chant-sequence: Array of chants in order
 * - dynamic: Runtime-resolved content
 */

import { renderGabc, renderAllGabc, waitForJgabc, extendStaffLines, cancelRender } from './renderer.js';
import { getMarianSeason } from '../liturgical/marian-season.js';
import { getCurrentDate } from '../core/date-provider.js';

// Re-export cancelRender for use in app.js
export { cancelRender };

// Cache for loaded modules
const cache = {
  hours: {},
  gabc: {},
  translations: {}
};

/**
 * Resolver registry for dynamic sections
 * Each resolver returns an array of { gabcId, translationKey } objects
 */
const resolvers = {
  'marian-antiphon': (hourId) => {
    const { antiphonId, variant } = getMarianSeason(getCurrentDate(), hourId);

    // Build versicle ID based on antiphon and variant
    let versicleId;
    if (antiphonId === 'alma-redemptoris-mater') {
      versicleId = variant === 'advent'
        ? 'alma-redemptoris-versicle-advent'
        : 'alma-redemptoris-versicle-christmas';
    } else if (antiphonId === 'ave-regina-caelorum') {
      versicleId = 'ave-regina-versicle';
    } else if (antiphonId === 'regina-caeli-laetare') {
      versicleId = 'regina-caeli-versicle';
    } else {
      versicleId = 'salve-regina-versicle';
    }

    // Build prayer ID based on antiphon and variant
    let prayerId;
    if (antiphonId === 'alma-redemptoris-mater') {
      prayerId = variant === 'advent'
        ? 'alma-redemptoris-prayer-advent'
        : 'alma-redemptoris-prayer-christmas';
    } else if (antiphonId === 'ave-regina-caelorum') {
      prayerId = 'ave-regina-prayer';
    } else if (antiphonId === 'regina-caeli-laetare') {
      prayerId = 'regina-caeli-prayer';
    } else {
      prayerId = 'salve-regina-prayer';
    }

    return [
      { gabcId: antiphonId, translationKey: antiphonId },
      { gabcId: versicleId, translationKey: versicleId },
      { gabcId: prayerId, translationKey: prayerId }
    ];
  }
};

/**
 * Load an hour definition
 */
export async function loadHourDefinition(hourId) {
  if (cache.hours[hourId]) {
    return cache.hours[hourId];
  }

  try {
    const module = await import(`../../data/hours/${hourId}.js`);
    cache.hours[hourId] = module.default || module[hourId];
    return cache.hours[hourId];
  } catch (e) {
    console.error(`Failed to load hour definition: ${hourId}`, e);
    return null;
  }
}

/**
 * Load GABC content for a specific office, falling back to office 1
 */
export async function loadGabcContent(office = 1) {
  const key = `office${office}`;
  if (cache.gabc[key]) {
    return cache.gabc[key];
  }

  const gabc = {};

  try {
    // Load common GABC
    const [opening, closing, marianAntiphons] = await Promise.all([
      import('../../data/gabc/common/opening.js'),
      import('../../data/gabc/common/closing.js'),
      import('../../data/gabc/common/marian-antiphons.js')
    ]);
    Object.assign(gabc, opening.default || opening);
    Object.assign(gabc, closing.default || closing);
    Object.assign(gabc, marianAntiphons.default || marianAntiphons);

    // Try to load office-specific GABC, fall back to office 1
    const tryImport = (path, name, officeNum) =>
      import(path).catch((e) => {
        console.warn(`Failed to load ${name} for office ${officeNum}:`, e.message);
        return null;
      });

    const loadOfficeGabc = async (officeNum) => {
      const results = await Promise.all([
        tryImport(`../../data/gabc/office${officeNum}/antiphons.js`, 'antiphons', officeNum),
        tryImport(`../../data/gabc/office${officeNum}/psalms.js`, 'psalms', officeNum),
        tryImport(`../../data/gabc/office${officeNum}/hymns.js`, 'hymns', officeNum),
        tryImport(`../../data/gabc/office${officeNum}/versicles.js`, 'versicles', officeNum),
        tryImport(`../../data/gabc/office${officeNum}/chapters.js`, 'chapters', officeNum)
      ]);
      return results;
    };

    let [antiphons, psalms, hymns, versicles, chapters] = await loadOfficeGabc(office);

    // Fall back to office 1 if office-specific files not found
    if (!antiphons && !psalms && !hymns && !versicles && !chapters && office !== 1) {
      console.warn(`Office ${office} GABC not found, falling back to Office 1`);
      [antiphons, psalms, hymns, versicles, chapters] = await loadOfficeGabc(1);
    }

    if (antiphons) Object.assign(gabc, antiphons.default || antiphons);
    if (psalms) Object.assign(gabc, psalms.default || psalms);
    if (hymns) Object.assign(gabc, hymns.default || hymns);
    if (versicles) Object.assign(gabc, versicles.default || versicles);
    if (chapters) Object.assign(gabc, chapters.default || chapters);

    cache.gabc[key] = gabc;
    return gabc;
  } catch (e) {
    console.error(`Failed to load GABC for office ${office}`, e);
    return gabc;
  }
}

/**
 * Load translations for a specific office
 */
export async function loadTranslations(office = 1) {
  const key = `office${office}`;
  if (cache.translations[key]) {
    return cache.translations[key];
  }

  const translations = {};

  try {
    // Load common translations
    const [common, psalms] = await Promise.all([
      import('../../data/translations/common.js'),
      import('../../data/translations/psalms.js')
    ]);

    Object.assign(translations, common.default);
    Object.assign(translations, psalms.default);

    // Try to load office-specific translations, fall back to office 1
    let officeTranslations = await import(`../../data/translations/office${office}.js`).catch((e) => {
      console.warn(`Failed to load translations for office ${office}:`, e.message);
      return null;
    });

    if (!officeTranslations && office !== 1) {
      console.warn(`Office ${office} translations not found, falling back to Office 1`);
      officeTranslations = await import('../../data/translations/office1.js').catch((e) => {
        console.warn(`Failed to load fallback translations for office 1:`, e.message);
        return null;
      });
    }

    if (officeTranslations) {
      Object.assign(translations, officeTranslations.default);
    }

    cache.translations[key] = translations;
    return translations;
  } catch (e) {
    console.error(`Failed to load translations for office ${office}`, e);
    return translations;
  }
}

/**
 * Create a GABC script tag
 * @param {string} id - Base ID (will be prefixed with 'gabc-' to avoid conflicts)
 * @param {string} gabcContent - GABC notation content
 */
function createGabcScript(id, gabcContent) {
  const script = document.createElement('script');
  script.type = 'text/gabc';
  script.id = 'gabc-' + id;
  script.textContent = gabcContent;
  return script;
}

/**
 * Create a chant container div with skeleton loading placeholder
 * @param {string} gabcId - Base ID (will be prefixed with 'gabc-' to match script tag)
 */
function createChantDiv(gabcId) {
  const div = document.createElement('div');
  div.className = 'chant loading';
  div.setAttribute('data-gabc-id', 'gabc-' + gabcId);

  // Add skeleton placeholder
  const skeleton = document.createElement('div');
  skeleton.className = 'chant-skeleton-container';
  skeleton.innerHTML = `
    <div class="chant-skeleton chant-skeleton-staff"></div>
    <div class="chant-skeleton chant-skeleton-notes"></div>
    <div class="chant-skeleton chant-skeleton-text"></div>
  `;
  div.appendChild(skeleton);

  return div;
}

/**
 * Create a translation span
 */
function createTranslationSpan(key) {
  const span = document.createElement('span');
  span.className = 'translation';
  span.setAttribute('data-translation-key', key);
  return span;
}

/**
 * Append a complete chant element (GABC script + container + translation)
 * DRY helper to reduce repeated 3-line pattern
 * @param {HTMLElement} container - Parent container to append to
 * @param {string} gabcId - ID for the GABC script and chant div
 * @param {string} gabcContent - GABC content string
 * @param {string} translationKey - Key for translation lookup
 */
function appendChant(container, gabcId, gabcContent, translationKey) {
  container.appendChild(createGabcScript(gabcId, gabcContent));
  container.appendChild(createChantDiv(gabcId));
  container.appendChild(createTranslationSpan(translationKey));
}

/**
 * Create a label element with translation key
 * @param {string} labelKey - Translation key for the label
 * @param {string} [className='chant-label'] - CSS class
 * @param {string} [fallbackText=''] - Fallback text before translations load
 */
function createLabelWithKey(labelKey, className = 'chant-label', fallbackText = '') {
  const span = document.createElement('span');
  span.className = className;
  span.setAttribute('data-translation-key', labelKey);
  span.textContent = fallbackText;
  return span;
}

/**
 * Render a chant section (single chant with optional label)
 * Handles: bare chants, labeled chants (psalm, hymn, chapter)
 */
function renderChant(section, gabc, container) {
  const wrapper = document.createElement('div');
  if (section.id) {
    wrapper.id = section.id;
  }

  // Add label if present
  if (section.labelKey) {
    const label = document.createElement('span');
    label.className = 'chant-label';

    // Label text with translation key
    const labelText = document.createElement('span');
    if (section.reference) {
      // Chapter style: italic label followed by reference
      labelText.className = 'ita mr';
    }
    labelText.setAttribute('data-translation-key', section.labelKey);
    label.appendChild(labelText);

    // Add incipit if present (Latin text after label)
    if (section.incipit) {
      const incipitSpan = document.createElement('span');
      incipitSpan.className = 'ita ml';
      incipitSpan.textContent = section.incipit + '.';
      label.appendChild(incipitSpan);
    }

    // Add reference if present (scripture citation)
    if (section.reference) {
      label.appendChild(document.createTextNode(section.reference));
    }

    wrapper.appendChild(label);
  }

  // Add chant
  if (gabc[section.gabcId]) {
    appendChant(wrapper, section.gabcId, gabc[section.gabcId], section.translationKey);
  }

  container.appendChild(wrapper);
}

/**
 * Render a chants-with-antiphon section (multiple chants wrapped by antiphon)
 * Antiphon appears before first chant and after last chant
 * Handles: psalm sections, canticle sections (e.g., Magnificat, Benedictus, Nunc Dimittis)
 */
function renderChantsWithAntiphon(section, gabc, container) {
  if (!section.chants?.length) {
    console.warn('chants-with-antiphon section has no chants:', section);
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.id = section.id || section.antiphonKey;

  const antiphonGabc = gabc[section.antiphonKey];

  // Pre-antiphon (before first chant)
  if (antiphonGabc) {
    const antLabel = document.createElement('span');
    antLabel.className = 'chant-label ita';
    antLabel.setAttribute('data-translation-key', 'ui-ant');
    antLabel.textContent = 'Ant.';
    wrapper.appendChild(antLabel);

    appendChant(wrapper, `${section.antiphonKey}-pre`, antiphonGabc, `${section.antiphonKey}-pre`);
  }

  // All chants in sequence
  for (const chant of section.chants) {
    const chantGabc = gabc[chant.gabcId];
    if (chantGabc) {
      const chantLabel = document.createElement('span');
      chantLabel.className = 'chant-label';

      const labelSpan = document.createElement('span');
      labelSpan.setAttribute('data-translation-key', chant.labelKey);
      chantLabel.appendChild(labelSpan);

      if (chant.incipit) {
        const incipitSpan = document.createElement('span');
        incipitSpan.className = 'ita ml';
        incipitSpan.textContent = chant.incipit + '.';
        chantLabel.appendChild(incipitSpan);
      }
      wrapper.appendChild(chantLabel);

      appendChant(wrapper, chant.gabcId, chantGabc, chant.translationKey);
    }
  }

  // Post-antiphon (after last chant)
  if (antiphonGabc) {
    const antLabel2 = document.createElement('span');
    antLabel2.className = 'chant-label ita';
    antLabel2.setAttribute('data-translation-key', 'ui-ant');
    antLabel2.textContent = 'Ant.';
    wrapper.appendChild(antLabel2);

    appendChant(wrapper, `${section.antiphonKey}-post`, antiphonGabc, `${section.antiphonKey}-post`);
  }

  container.appendChild(wrapper);
}

/**
 * Render chant-variants section (multiple alternative chants)
 * Handles: versicle variants (solemn vs simple)
 * If all variants share the same translationKey, shows translation once at the bottom
 */
function renderChantVariants(section, gabc, container) {
  if (!section.variants) return;

  const wrapper = document.createElement('div');
  if (section.id) {
    wrapper.id = section.id;
  }

  // Check if all variants have the same translation key
  const translationKeys = section.variants.map(v => v.translationKey);
  const allSameTranslation = translationKeys.every(k => k === translationKeys[0]);

  for (const variant of section.variants) {
    const label = document.createElement('span');
    label.className = 'ita crimson';
    label.setAttribute('data-translation-key', variant.labelKey);
    label.textContent = variant.labelKey === 'ui-sundays-feasts' ? 'Sundays and feasts' : 'All other times';
    wrapper.appendChild(label);

    if (gabc[variant.gabcId]) {
      if (allSameTranslation) {
        // Only render GABC without translation
        wrapper.appendChild(createGabcScript(variant.gabcId, gabc[variant.gabcId]));
        wrapper.appendChild(createChantDiv(variant.gabcId));
      } else {
        // Render with individual translation
        appendChant(wrapper, variant.gabcId, gabc[variant.gabcId], variant.translationKey);
      }
    }
  }

  // Add single translation at the end if all variants share the same key
  if (allSameTranslation && translationKeys[0]) {
    wrapper.appendChild(createTranslationSpan(translationKeys[0]));
  }

  container.appendChild(wrapper);
}

/**
 * Render chant-sequence section (array of chants in order)
 * Handles: closing prayers
 */
function renderChantSequence(section, gabc, container) {
  const wrapper = document.createElement('div');
  if (section.id) {
    wrapper.id = section.id;
  }

  // Track used IDs to handle duplicates
  const usedIds = {};

  for (const item of section.items) {
    if (gabc[item.gabcId]) {
      // Generate unique ID for duplicates
      usedIds[item.gabcId] = (usedIds[item.gabcId] || 0) + 1;
      const uniqueId = usedIds[item.gabcId] > 1
        ? `${item.gabcId}-${usedIds[item.gabcId]}`
        : item.gabcId;

      appendChant(wrapper, uniqueId, gabc[item.gabcId], item.translationKey);
    }
  }

  container.appendChild(wrapper);
}

/**
 * Render dynamic section (runtime-resolved content)
 * Handles: marian-antiphon (seasonal selection)
 */
function renderDynamic(section, gabc, container, hourId) {
  const resolver = resolvers[section.resolver];
  if (!resolver) {
    console.warn(`Unknown resolver: ${section.resolver}`);
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.id = section.id || section.resolver;

  // Add label if present
  if (section.labelKey) {
    const label = document.createElement('span');
    label.className = 'chant-label';
    label.setAttribute('data-translation-key', section.labelKey);
    wrapper.appendChild(label);
  }

  // Get resolved content and render each chant
  let items;
  try {
    items = resolver(hourId);
  } catch (e) {
    console.error(`Resolver '${section.resolver}' failed for hour '${hourId}':`, e);
    return;
  }
  for (const item of items) {
    if (gabc[item.gabcId]) {
      appendChant(wrapper, item.gabcId, gabc[item.gabcId], item.translationKey);
    }
  }

  container.appendChild(wrapper);
}

/**
 * Apply translations to the rendered content
 */
export function applyTranslations(container, translations, lang) {
  // Batch all DOM updates in a single animation frame to prevent layout thrashing
  requestAnimationFrame(() => {
    // UI translations (not .translation class)
    const uiElements = container.querySelectorAll('[data-translation-key]:not(.translation)');
    const translationElements = container.querySelectorAll('.translation');

    uiElements.forEach(el => {
      const key = el.dataset.translationKey;
      const translation = translations[key];
      if (translation && translation[lang]) {
        el.textContent = translation[lang];
      }
    });

    // Chant translations (.translation class)
    translationElements.forEach(el => {
      const key = el.dataset.translationKey;
      // For antiphons, -pre and -post share the same translation
      const baseKey = key.replace(/-(pre|post)$/, '');
      const translation = translations[key] || translations[baseKey];
      if (translation && translation[lang]) {
        el.textContent = translation[lang];
      }
    });
  });
}

/**
 * Main function to render an hour
 */
export async function renderHour(hourId, container, options = {}) {
  const office = options.office || 1;
  const lang = options.lang || 'en';

  // Load data
  const [hourDef, gabc, translations] = await Promise.all([
    loadHourDefinition(hourId),
    loadGabcContent(office),
    loadTranslations(office)
  ]);

  if (!hourDef) {
    container.innerHTML = `<p class="error">Hour "${hourId}" not found.</p>`;
    return;
  }

  // Clear container
  container.innerHTML = '';

  // Add title
  const title = document.createElement('h1');
  const titleKey = `ui-title-${hourId}`;
  title.setAttribute('data-translation-key', titleKey);
  title.textContent = translations[titleKey]?.[lang] || translations[titleKey]?.en || hourId;
  container.appendChild(title);

  // Add description
  if (hourDef.descriptionKey) {
    const desc = document.createElement('p');
    desc.className = 'description';
    desc.setAttribute('data-translation-key', hourDef.descriptionKey);
    container.appendChild(desc);
  }

  // Render each section
  for (const section of hourDef.structure) {
    switch (section.type) {
      case 'chant':
        renderChant(section, gabc, container);
        break;
      case 'chants-with-antiphon':
        renderChantsWithAntiphon(section, gabc, container);
        break;
      case 'chant-variants':
        renderChantVariants(section, gabc, container);
        break;
      case 'chant-sequence':
        renderChantSequence(section, gabc, container);
        break;
      case 'dynamic':
        renderDynamic(section, gabc, container, hourId);
        break;
      default:
        console.warn(`Unknown section type: ${section.type}`);
    }
  }

  // Apply translations
  applyTranslations(container, translations, lang);

  // Call onStructureReady callback before async rendering
  if (options.onStructureReady) {
    options.onStructureReady();
  }

  // Wait for fonts to load, then render GABC
  await new Promise(resolve => {
    const doRender = () => {
      waitForJgabc(async () => {
        await renderAllGabc(container);
        resolve();
      });
    };

    if (document.fonts && document.fonts.ready) {
      // Wait for fonts.ready, then explicitly check Caeciliae font is loaded
      document.fonts.ready.then(() => {
        // Check if Caeciliae (chant notation font) is actually loaded
        const checkCaeciliae = () => {
          try {
            return document.fonts.check('24px Caeciliae');
          } catch (e) {
            return false;
          }
        };

        if (checkCaeciliae()) {
          doRender();
        } else {
          // Poll for Caeciliae font with timeout
          let attempts = 0;
          const maxAttempts = 40; // 2 seconds max
          const pollFont = () => {
            attempts++;
            if (checkCaeciliae() || attempts >= maxAttempts) {
              doRender();
            } else {
              setTimeout(pollFont, 50);
            }
          };
          pollFont();
        }
      });
    } else {
      setTimeout(doRender, 500);
    }
  });

  return { hourDef, gabc, translations };
}

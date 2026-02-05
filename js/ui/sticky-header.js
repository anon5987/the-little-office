/**
 * Sticky Header Module
 * Manages the sticky header controls and menu
 */

import { IDS, getElement } from '../utils/selectors.js';
import { getState, set } from '../core/state.js';
import { CSS_CLASSES } from '../core/constants.js';
import { createEventScope, SCOPES } from '../utils/event-manager.js';
import { updateUITranslations } from './translation-manager.js';
import { formatDateForInput, getCurrentDate } from '../core/date-provider.js';
import { getHourNameTranslated } from '../utils/translation-helpers.js';

// Module-level state for language switching functionality
/** @type {string|null} Current hour ID for updating section name on language change */
let currentHourId = null;
/** @type {{hourDef: import('../core/types.js').HourDefinition, translations: import('../core/types.js').Translations}|null} */
let currentHourDataRef = null;
/** @type {Function|null} Callback to apply translations when language changes */
let applyTranslationsFn = null;
/** @type {import('../core/types.js').Translations|null} UI translations for header menu items */
let uiTranslationsRef = null;

/**
 * Set UI translations reference for header menu items
 * @param {import('../core/types.js').Translations} translations
 */
export function setUITranslations(translations) {
  uiTranslationsRef = translations;
}

/**
 * Set the current hour data reference for language switching
 * @param {{hourDef: import('../core/types.js').HourDefinition, translations: import('../core/types.js').Translations}} hourData
 * @param {Function} applyFn - Function to apply translations
 */
export function setCurrentHourData(hourData, applyFn) {
  currentHourDataRef = hourData;
  applyTranslationsFn = applyFn;
}

/**
 * Clear the current hour data reference
 */
export function clearCurrentHourData() {
  currentHourId = null;
  currentHourDataRef = null;
  applyTranslationsFn = null;
}

/**
 * Initialize sticky header controls
 */
export function initStickyHeader() {
  const state = getState();
  const events = createEventScope(SCOPES.STICKY_HEADER);

  const menuBtn = getElement(IDS.MENU_BTN);
  const menu = getElement(IDS.HEADER_MENU);
  const backBtn = getElement(IDS.HEADER_BACK);
  const langSelector = getElement(IDS.LANGUAGE_SELECTOR);
  const showTransCheckbox = getElement(IDS.SHOW_TRANSLATIONS);
  const darkModeBtn = getElement(IDS.DARK_MODE_BTN);
  const darkModeIcon = getElement(IDS.DARK_MODE_ICON);

  // Menu toggle
  if (menuBtn && menu) {
    events.add(menuBtn, 'click', (e) => {
      e.stopPropagation();
      menu.classList.toggle(CSS_CLASSES.HIDDEN);
    });

    // Close menu when clicking outside
    events.add(document, 'click', () => {
      menu.classList.add(CSS_CLASSES.HIDDEN);
    });

    events.add(menu, 'click', (e) => {
      e.stopPropagation();
    });
  }

  // Back button
  if (backBtn) {
    events.add(backBtn, 'click', (e) => {
      e.preventDefault();
      window.location.hash = '';
    });
  }

  // Language selector
  if (langSelector) {
    langSelector.value = state.language || 'en';
    events.add(langSelector, 'change', (e) => {
      const newLang = e.target.value;
      set('language', newLang);

      // Update UI translations (header menu items, etc.)
      if (uiTranslationsRef) {
        updateUITranslations(uiTranslationsRef, newLang);
      }

      // Update section name (hour title) in header
      if (currentHourId) {
        const sectionNameEl = getElement(IDS.SECTION_NAME);
        if (sectionNameEl) {
          sectionNameEl.textContent = getHourNameTranslated(currentHourId, newLang);
        }
      }

      // Update hour content translations without re-rendering GABC
      if (currentHourDataRef && currentHourDataRef.translations && applyTranslationsFn) {
        const contentArea = getElement(IDS.HOUR_CONTENT_AREA);
        if (contentArea) {
          applyTranslationsFn(contentArea, currentHourDataRef.translations, newLang);
        }
      }
    });
  }

  // Show translations checkbox
  if (showTransCheckbox) {
    showTransCheckbox.checked = state.showTranslations;
    document.body.classList.toggle(CSS_CLASSES.SHOW_TRANSLATIONS, state.showTranslations);
    events.add(showTransCheckbox, 'change', () => {
      set('showTranslations', showTransCheckbox.checked);
      document.body.classList.toggle(CSS_CLASSES.SHOW_TRANSLATIONS, showTransCheckbox.checked);
    });
  }

  // Dark mode button - apply initial state
  if (state.darkMode) {
    document.body.classList.add(CSS_CLASSES.DARK_MODE);
    if (darkModeIcon) darkModeIcon.textContent = '🌙';
  }

  if (darkModeBtn) {
    events.add(darkModeBtn, 'click', () => {
      const isDark = !getState().darkMode;
      document.body.classList.toggle(CSS_CLASSES.DARK_MODE, isDark);
      set('darkMode', isDark);
      if (darkModeIcon) darkModeIcon.textContent = isDark ? '🌙' : '☀️';
    });
  }

  // Date override controls
  const dateInput = getElement(IDS.DATE_OVERRIDE_INPUT);
  const dateClearBtn = getElement(IDS.DATE_OVERRIDE_CLEAR);

  if (dateInput) {
    // Set initial value if override exists
    if (state.dateOverride) {
      dateInput.value = formatDateForInput(new Date(state.dateOverride));
      if (dateClearBtn) dateClearBtn.classList.remove(CSS_CLASSES.HIDDEN);
    }

    events.add(dateInput, 'change', (e) => {
      const value = e.target.value;
      if (value) {
        const date = new Date(value);
        set('dateOverride', date.toISOString());
        if (dateClearBtn) dateClearBtn.classList.remove(CSS_CLASSES.HIDDEN);
      } else {
        set('dateOverride', null);
        if (dateClearBtn) dateClearBtn.classList.add(CSS_CLASSES.HIDDEN);
      }
    });
  }

  if (dateClearBtn) {
    events.add(dateClearBtn, 'click', () => {
      set('dateOverride', null);
      if (dateInput) dateInput.value = '';
      dateClearBtn.classList.add(CSS_CLASSES.HIDDEN);
    });
  }
}

/**
 * Show sticky header with section name
 * @param {string} sectionName - Name to display in header
 * @param {string} [hourId] - Hour ID for language switching
 */
export function showStickyHeader(sectionName, hourId = null) {
  const header = getElement(IDS.STICKY_HEADER);
  const sectionNameEl = getElement(IDS.SECTION_NAME);

  // Store hour ID for language switching
  currentHourId = hourId;

  if (header) {
    header.classList.remove(CSS_CLASSES.HIDDEN);
  }
  if (sectionNameEl && sectionName) {
    sectionNameEl.textContent = sectionName;
  }
}

/**
 * Hide sticky header
 */
export function hideStickyHeader() {
  const header = getElement(IDS.STICKY_HEADER);
  if (header) {
    header.classList.add(CSS_CLASSES.HIDDEN);
  }
}

/**
 * Update the language selector value
 * @param {string} lang - Language code
 */
export function updateLanguageSelector(lang) {
  const langSelector = getElement(IDS.LANGUAGE_SELECTOR);
  if (langSelector) {
    langSelector.value = lang;
  }
}

/**
 * Translation Manager Module
 * Handles UI and chant translations
 */

import { IDS, getElement } from '../utils/selectors.js';

// Update UI elements with translations (not chant translations)
export function updateUITranslations(translations, lang) {
  if (!translations) return;
  // Update all elements with data-translation-key that are NOT .translation (chant translations)
  document.querySelectorAll("[data-translation-key]:not(.translation)").forEach(function (el) {
    var key = el.dataset.translationKey;
    var translation = translations[key];
    if (translation && translation[lang]) {
      el.textContent = translation[lang];
    }
  });
}

// Update chant translation elements
export function updateChantTranslations(translations, lang) {
  if (!translations) return;
  document.querySelectorAll(".translation").forEach(function (el) {
    var key = el.dataset.translationKey;
    // For antiphons, -pre and -post share the same translation
    var baseKey = key.replace(/-(pre|post)$/, "");
    var translation = translations[key] || translations[baseKey];
    if (translation && translation[lang]) {
      el.textContent = translation[lang];
    }
  });
}

// Initialize translation controls
export function initTranslations(translations) {
  var checkbox = getElement(IDS.SHOW_TRANSLATIONS);
  var langSelect = getElement(IDS.LANGUAGE_SELECTOR);

  if (!langSelect) return;

  // Checkbox toggles chant translation visibility
  if (checkbox) {
    checkbox.addEventListener("change", function () {
      document.body.classList.toggle("show-translations", checkbox.checked);
    });
  }

  // Language selector updates both UI and chant translations
  langSelect.addEventListener("change", function () {
    updateUITranslations(translations, langSelect.value);
    updateChantTranslations(translations, langSelect.value);
  });

  // Initialize all translations with default language
  updateUITranslations(translations, langSelect.value);
  updateChantTranslations(translations, langSelect.value);

  // Return current language for external use
  return langSelect.value;
}


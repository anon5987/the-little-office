/**
 * Sticky Header Module
 * Manages the sticky header controls and menu
 */

import { IDS, getElement } from './selectors.js';
import { getState, set } from './state.js';
import { CSS_CLASSES } from './constants.js';
import { createEventScope, SCOPES } from './event-manager.js';

// Store current hour data reference for language switching
let currentHourDataRef = null;
let applyTranslationsFn = null;

/**
 * Set the current hour data reference for language switching
 * @param {Object} hourData - Hour data with translations
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

      // Update translations without re-rendering GABC
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
}

/**
 * Show sticky header with section name
 * @param {string} sectionName - Name to display in header
 */
export function showStickyHeader(sectionName) {
  const header = getElement(IDS.STICKY_HEADER);
  const sectionNameEl = getElement(IDS.SECTION_NAME);

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

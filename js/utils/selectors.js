/**
 * DOM Selectors Module
 * Centralizes all DOM element ID references to eliminate magic strings
 */

// Element IDs used throughout the application
export const IDS = {
  // Sticky header
  STICKY_HEADER: 'sticky-header',
  MENU_BTN: 'menu-btn',
  HEADER_MENU: 'header-menu',
  HEADER_BACK: 'header-back',
  SECTION_NAME: 'section-name',

  // Controls
  LANGUAGE_SELECTOR: 'language-selector',
  SHOW_TRANSLATIONS: 'show-translations',
  DARK_MODE_BTN: 'dark-mode-btn',
  DARK_MODE_ICON: 'dark-mode-icon',
  DARK_MODE_CHECKBOX: 'dark-mode-checkbox',

  // Content areas
  APP_CONTENT: 'app-content',
  HOUR_CONTENT: 'hour-content',
  HOUR_CONTENT_AREA: 'hour-content-area',

  // Landing page controls
  LANDING_LANGUAGE_SELECTOR: 'landing-language-selector',
  LANDING_DARK_MODE: 'landing-dark-mode',

  // Date override controls
  DATE_OVERRIDE_INPUT: 'date-override-input',
  DATE_OVERRIDE_CLEAR: 'date-override-clear',
};

// CSS selectors for querying elements
export const SELECTORS = {
  LANDING_PAGE: '.landing-page',
  CHANT: '.chant',
  CHANT_LOADING: '.chant.loading',
  CHANT_SVG: '[data-gabc] svg, [data-gabc-id] svg',
  GABC_ELEMENTS: '[data-gabc], [data-gabc-id]',
  TRANSLATION_KEY: '[data-translation-key]',
  TRANSLATION_CLASS: '.translation',
  TSPAN_RUBRIC: 'tspan.rubric',
  SVG_TEXT: 'svg text',
  HOUR_SECTIONS: '#hour-content-area > div[id]',
};

/**
 * Get an element by its ID constant
 * @param {string} id - ID from IDS constant
 * @returns {HTMLElement|null}
 */
export function getElement(id) {
  return document.getElementById(id);
}


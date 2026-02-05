/**
 * Translation Helpers Module
 * Shared translation utilities to eliminate duplication across pages
 */

import { HOUR_NAME_KEYS } from '../core/constants.js';

// Translation cache for hour names and UI strings
let translationsCache = null;

/**
 * Set translations cache for hour names and UI strings
 * @param {Object} translations - Translation data
 */
export function setTranslationsCache(translations) {
  translationsCache = translations;
}

/**
 * Get hour name from translations or fallback
 * @param {string} hourId - Hour identifier
 * @param {string} lang - Language code
 * @returns {string}
 */
export function getHourNameTranslated(hourId, lang) {
  const key = HOUR_NAME_KEYS[hourId];
  if (translationsCache && key && translationsCache[key]) {
    return translationsCache[key][lang] || translationsCache[key].en || hourId;
  }
  // Fallback to capitalized ID
  return hourId.charAt(0).toUpperCase() + hourId.slice(1);
}

/**
 * Get translation by key
 * @param {string} key - Translation key
 * @param {string} lang - Language code
 * @returns {string}
 */
export function t(key, lang) {
  if (translationsCache && translationsCache[key]) {
    return translationsCache[key][lang] || translationsCache[key].en || key;
  }
  return key;
}

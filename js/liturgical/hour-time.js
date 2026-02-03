/**
 * Hour Time Module
 *
 * Determines which canonical hour to recommend based on the current time.
 * Times are configurable - these are traditional approximations.
 */

import { HOUR_ORDER, HOUR_NAME_KEYS } from '../core/constants.js';

// Default hour time ranges (24-hour format)
// These can be overridden via setHourTimes()
let HOUR_TIMES = {
  matins:   { start: 0,  end: 3 },   // Midnight to 3 AM
  lauds:    { start: 3,  end: 6 },   // 3 AM to 6 AM (dawn)
  prime:    { start: 6,  end: 9 },   // 6 AM to 9 AM (first hour)
  terce:    { start: 9,  end: 12 },  // 9 AM to noon (third hour)
  sext:     { start: 12, end: 15 },  // Noon to 3 PM (sixth hour)
  none:     { start: 15, end: 18 },  // 3 PM to 6 PM (ninth hour)
  vespers:  { start: 18, end: 21 },  // 6 PM to 9 PM (evening)
  compline: { start: 21, end: 24 }   // 9 PM to midnight (before sleep)
};

// Cache for hour name translations
let hourNameTranslationsCache = null;

/**
 * Set hour name translations cache
 * @param {Object} translations - Translation object with hour name keys
 */
export function setHourNameTranslations(translations) {
  hourNameTranslationsCache = translations;
}

/**
 * Set custom hour times
 * @param {Object} times - Object with hour names as keys and {start, end} as values
 */
export function setHourTimes(times) {
  HOUR_TIMES = { ...HOUR_TIMES, ...times };
}

/**
 * Get the current hour times configuration
 */
export function getHourTimes() {
  return { ...HOUR_TIMES };
}

/**
 * Get the canonical hour for a given time
 * @param {Date} date - The date/time to check (default: now)
 * @returns {string} - The hour ID (matins, lauds, etc.)
 */
export function getCurrentHour(date = new Date()) {
  const hour = date.getHours();

  for (const [hourId, times] of Object.entries(HOUR_TIMES)) {
    if (hour >= times.start && hour < times.end) {
      return hourId;
    }
  }

  // Fallback (shouldn't happen with 24-hour coverage)
  return 'compline';
}

/**
 * Get the next canonical hour after the current one
 * @param {Date} date - The date/time to check (default: now)
 * @returns {string} - The next hour ID
 */
export function getNextHour(date = new Date()) {
  const currentHour = getCurrentHour(date);
  const currentIndex = HOUR_ORDER.indexOf(currentHour);
  return HOUR_ORDER[(currentIndex + 1) % HOUR_ORDER.length];
}

/**
 * Get the previous canonical hour
 * @param {Date} date - The date/time to check (default: now)
 * @returns {string} - The previous hour ID
 */
export function getPreviousHour(date = new Date()) {
  const currentHour = getCurrentHour(date);
  const currentIndex = HOUR_ORDER.indexOf(currentHour);
  return HOUR_ORDER[(currentIndex - 1 + HOUR_ORDER.length) % HOUR_ORDER.length];
}

/**
 * Get a recommendation for which hour to pray
 * If we're in the last quarter of a time window, suggest the next hour
 * @param {Date} date - The date/time to check (default: now)
 * @returns {Object} - { primary: string, secondary: string }
 */
export function getRecommendation(date = new Date()) {
  const hour = date.getHours();
  const currentHourId = getCurrentHour(date);
  const times = HOUR_TIMES[currentHourId];

  // Calculate if we're in the last quarter of the window
  const windowLength = times.end - times.start;
  const windowMidpoint = times.start + (windowLength * 0.75);

  if (hour >= windowMidpoint) {
    // Suggest next hour as primary, current as secondary
    return {
      primary: getNextHour(date),
      secondary: currentHourId
    };
  }

  // Suggest current hour as primary, next as secondary
  return {
    primary: currentHourId,
    secondary: getNextHour(date)
  };
}

/**
 * Get display name for an hour
 * Uses translation cache if available, falls back to static names
 */
export function getHourName(hourId, lang = 'en') {
  // Try translation cache first
  const key = HOUR_NAME_KEYS[hourId];
  if (hourNameTranslationsCache && key && hourNameTranslationsCache[key]) {
    return hourNameTranslationsCache[key][lang] || hourNameTranslationsCache[key].en || hourId;
  }

  // Fallback to static names for backwards compatibility
  const names = {
    matins:   { en: 'Matins',   cs: 'Matutinum',     la: 'Matutinum' },
    lauds:    { en: 'Lauds',    cs: 'Ranní chvály',  la: 'Laudes' },
    prime:    { en: 'Prime',    cs: 'Prima',         la: 'Prima' },
    terce:    { en: 'Terce',    cs: 'Tercie',        la: 'Tertia' },
    sext:     { en: 'Sext',     cs: 'Sexta',         la: 'Sexta' },
    none:     { en: 'None',     cs: 'Nona',          la: 'Nona' },
    vespers:  { en: 'Vespers',  cs: 'Nešpory',       la: 'Vesperæ' },
    compline: { en: 'Compline', cs: 'Kompletář',     la: 'Completorium' }
  };
  return names[hourId]?.[lang] || names[hourId]?.en || hourId;
}

/**
 * Get description for an hour
 */
export function getHourDescription(hourId, lang = 'en') {
  const descriptions = {
    matins: {
      en: 'The night office, traditionally prayed at midnight or before dawn.',
      cs: 'Noční oficium, tradičně se modlí o půlnoci nebo před úsvitem.'
    },
    lauds: {
      en: 'Morning praise, prayed at dawn to greet the rising sun.',
      cs: 'Ranní chvály, modlí se za úsvitu k přivítání vycházejícího slunce.'
    },
    prime: {
      en: 'The first hour of the day, prayed at sunrise (6 AM).',
      cs: 'První hodina dne, modlí se při východu slunce (6:00).'
    },
    terce: {
      en: 'The third hour, prayed at mid-morning (9 AM).',
      cs: 'Třetí hodina, modlí se v dopoledne (9:00).'
    },
    sext: {
      en: 'The sixth hour, prayed at noon.',
      cs: 'Šestá hodina, modlí se v poledne.'
    },
    none: {
      en: 'The ninth hour, prayed in mid-afternoon (3 PM).',
      cs: 'Devátá hodina, modlí se v odpoledne (15:00).'
    },
    vespers: {
      en: 'Evening prayer, prayed at sunset.',
      cs: 'Večerní modlitba, modlí se při západu slunce.'
    },
    compline: {
      en: 'Night prayer, prayed before retiring to sleep.',
      cs: 'Noční modlitba, modlí se před spaním.'
    }
  };
  return descriptions[hourId]?.[lang] || descriptions[hourId]?.en || '';
}

/**
 * Get all hours with their current status
 */
export function getAllHoursStatus(date = new Date()) {
  const recommendation = getRecommendation(date);

  return HOUR_ORDER.map(hourId => ({
    id: hourId,
    name: getHourName(hourId),
    description: getHourDescription(hourId),
    times: HOUR_TIMES[hourId],
    isPrimary: hourId === recommendation.primary,
    isSecondary: hourId === recommendation.secondary,
    isCurrent: hourId === getCurrentHour(date)
  }));
}

/**
 * Marian Season Detection Module
 *
 * Determines which Marian antiphon to use based on the liturgical calendar.
 *
 * Season periods:
 * 1. alma-redemptoris-mater: Advent 1 Vespers → Feb 2 Compline
 *    - variant 'advent': Advent 1 → Dec 24
 *    - variant 'christmas': Dec 25 → Feb 2
 * 2. ave-regina-caelorum: Feb 2 (after Compline) → Easter Vigil
 * 3. regina-caeli-laetare: Easter → Trinity Sunday Compline
 * 4. salve-regina: Trinity Monday → Advent 1 Eve
 */

import { getFirstSundayOfAdvent } from './season.js';

/**
 * Calculate Easter date using the Anonymous Gregorian algorithm (Computus)
 * @param {number} year - The year to calculate Easter for
 * @returns {Date} Easter Sunday date
 */
export function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

/**
 * Calculate Trinity Sunday (Easter + 56 days / 8 weeks)
 * @param {number} year - The year to calculate Trinity Sunday for
 * @returns {Date} Trinity Sunday date
 */
export function getTrinitySunday(year) {
  const easter = getEasterDate(year);
  const trinity = new Date(easter);
  trinity.setDate(trinity.getDate() + 56);
  return trinity;
}

/**
 * Calculate First Sunday of Advent (4th Sunday before Christmas)
 * @param {number} year - The year to calculate Advent 1 for
 * @returns {Date} First Sunday of Advent
 * @deprecated Use getFirstSundayOfAdvent from season.js instead
 */
export function getAdvent1(year) {
  return getFirstSundayOfAdvent(year);
}

/**
 * Get Marian season information for a given date
 * @param {Date} [date=new Date()] - Date to check (defaults to today)
 * @returns {{ antiphonId: string, variant: string|null, season: string }}
 */
export function getMarianSeason(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  // Key dates for current year
  const easter = getEasterDate(year);
  const trinity = getTrinitySunday(year);
  const advent1 = getAdvent1(year);
  const feb2 = new Date(year, 1, 2);
  const dec24 = new Date(year, 11, 24);
  const dec25 = new Date(year, 11, 25);

  // Previous year's Advent 1 (for dates in Jan/early Feb)
  const prevAdvent1 = getAdvent1(year - 1);

  // Normalize to midnight for comparison
  const normalizeDate = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const today = normalizeDate(date);

  // 1. Check Alma Redemptoris Mater period
  // From Advent 1 Vespers to Feb 2 Compline
  if (today >= normalizeDate(advent1) && today <= normalizeDate(new Date(year, 11, 31))) {
    // After Advent 1 in current year
    const variant = today <= normalizeDate(dec24) ? 'advent' : 'christmas';
    return {
      antiphonId: 'alma-redemptoris-mater',
      variant,
      season: 'alma-redemptoris'
    };
  }

  if (today >= normalizeDate(new Date(year, 0, 1)) && today <= normalizeDate(feb2)) {
    // Jan 1 to Feb 2 (continuing from previous year's Advent)
    return {
      antiphonId: 'alma-redemptoris-mater',
      variant: 'christmas',
      season: 'alma-redemptoris'
    };
  }

  // 2. Check Ave Regina Caelorum period
  // From Feb 2 (after Compline) to Easter Vigil
  const feb3 = new Date(year, 1, 3);
  const easterVigil = new Date(easter);
  easterVigil.setDate(easter.getDate() - 1);

  if (today >= normalizeDate(feb3) && today < normalizeDate(easter)) {
    return {
      antiphonId: 'ave-regina-caelorum',
      variant: null,
      season: 'ave-regina'
    };
  }

  // 3. Check Regina Caeli period
  // From Easter to Trinity Sunday Compline
  if (today >= normalizeDate(easter) && today <= normalizeDate(trinity)) {
    return {
      antiphonId: 'regina-caeli-laetare',
      variant: null,
      season: 'regina-caeli'
    };
  }

  // 4. Salve Regina (default)
  // From Trinity Monday to Advent 1 Eve
  return {
    antiphonId: 'salve-regina',
    variant: null,
    season: 'salve-regina'
  };
}

export default { getEasterDate, getTrinitySunday, getAdvent1, getMarianSeason, getFirstSundayOfAdvent };

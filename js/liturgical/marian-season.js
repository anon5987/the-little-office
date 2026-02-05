/**
 * Marian Season Detection Module
 *
 * Determines which Marian antiphon to use based on the liturgical calendar.
 *
 * Season periods:
 * 1. alma-redemptoris-mater: Advent 1 Vespers → Feb 2 Compline
 *    - variant 'advent': Advent 1 → Dec 24
 *    - variant 'christmas': Dec 25 → Feb 2
 * 2. ave-regina-caelorum: Feb 2 (after Compline) → Good Friday
 * 3. regina-caeli-laetare: Holy Saturday (Easter Vigil) → Trinity Sunday Compline
 * 4. salve-regina: Trinity Monday → Advent 1 Eve
 */

import { getFirstSundayOfAdvent } from './season.js';

/**
 * Convert a Date to YYYYMMDD integer for comparison
 */
function toDateValue(date) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}

/**
 * Check if a date falls within an inclusive range
 */
function isDateInRange(date, start, end) {
  const value = toDateValue(date);
  return value >= toDateValue(start) && value <= toDateValue(end);
}

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
  return new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + 56);
}

/**
 * Create a result object for a Marian season
 */
function createResult(antiphonId, season, variant = null) {
  return { antiphonId, variant, season };
}

/**
 * Get Marian season information for a given date and hour
 * @param {Date} [date=new Date()] - Date to check (defaults to today)
 * @param {string} [hourId=null] - Hour being prayed (for boundary cases like Feb 2 Compline)
 * @returns {{ antiphonId: string, variant: string|null, season: string }}
 */
export function getMarianSeason(date = new Date(), hourId = null) {
  const year = date.getFullYear();

  // Key dates
  const easter = getEasterDate(year);
  const trinity = getTrinitySunday(year);
  const advent1 = getFirstSundayOfAdvent(year);
  const feb2 = new Date(year, 1, 2);
  const feb3 = new Date(year, 1, 3);
  const dec24 = new Date(year, 11, 24);
  const dec31 = new Date(year, 11, 31);
  const jan1 = new Date(year, 0, 1);

  // 1. Alma Redemptoris Mater: Advent 1 → Feb 2
  // Check current year's Advent period (Advent 1 through Dec 31)
  if (isDateInRange(date, advent1, dec31)) {
    const variant = toDateValue(date) <= toDateValue(dec24) ? 'advent' : 'christmas';
    return createResult('alma-redemptoris-mater', 'alma-redemptoris', variant);
  }

  // Check continuation from previous year's Advent (Jan 1 through Feb 1)
  // Feb 2 Compline is when Ave Regina begins
  const feb1 = new Date(year, 1, 1);
  if (isDateInRange(date, jan1, feb1)) {
    return createResult('alma-redemptoris-mater', 'alma-redemptoris', 'christmas');
  }

  // Feb 2: Alma for hours before Compline, Ave Regina from Compline onwards
  if (toDateValue(date) === toDateValue(feb2)) {
    if (hourId === 'compline') {
      return createResult('ave-regina-caelorum', 'ave-regina');
    }
    return createResult('alma-redemptoris-mater', 'alma-redemptoris', 'christmas');
  }

  // 2. Ave Regina Caelorum: Feb 3 → Good Friday
  const goodFriday = new Date(year, easter.getMonth(), easter.getDate() - 2);
  if (isDateInRange(date, feb3, goodFriday)) {
    return createResult('ave-regina-caelorum', 'ave-regina');
  }

  // 3. Regina Caeli: Holy Saturday (Easter Vigil) → Trinity Sunday
  const holySaturday = new Date(year, easter.getMonth(), easter.getDate() - 1);
  if (isDateInRange(date, holySaturday, trinity)) {
    return createResult('regina-caeli-laetare', 'regina-caeli');
  }

  // 4. Salve Regina: Trinity Monday → Advent 1 Eve (default)
  return createResult('salve-regina', 'salve-regina');
}

export default { getEasterDate, getTrinitySunday, getMarianSeason };

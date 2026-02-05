/**
 * Season Detection Module
 *
 * Determines which office (1, 2, or 3) to use based on date and hour.
 *
 * Office 1: Ordinary time (default)
 * Office 2: From Vespers of 1st Sunday of Advent until None of Christmas Eve (inclusive)
 * Office 3: From Vespers of Christmas Eve until Compline of Purification (Feb 2) (inclusive)
 */

// Hour ordering for boundary comparisons
export const HOUR_ORDER = {
  matins: 0,
  lauds: 1,
  prime: 2,
  terce: 3,
  sext: 4,
  none: 5,
  vespers: 6,
  compline: 7,
};

/**
 * Convert a Date to YYYYMMDD integer for easy comparison
 */
function toDateValue(date) {
  return (
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  );
}

/**
 * Check if an hour is at or after a reference hour in the daily cycle
 */
function isHourAtOrAfter(hourId, referenceHour) {
  return HOUR_ORDER[hourId] >= HOUR_ORDER[referenceHour];
}

/**
 * Check if an hour is before a reference hour in the daily cycle
 */
function isHourBefore(hourId, referenceHour) {
  return HOUR_ORDER[hourId] < HOUR_ORDER[referenceHour];
}

/**
 * Calculate the first Sunday of Advent for a given year
 * Advent 1 is the 4th Sunday before Christmas
 */
export function getFirstSundayOfAdvent(year) {
  // Christmas Day
  const christmas = new Date(year, 11, 25);
  // Find the Sunday on or before Christmas
  const christmasDow = christmas.getDay(); // 0 = Sunday
  // Days to go back to get to the Sunday before Christmas
  const daysToSunday = christmasDow === 0 ? 7 : christmasDow;
  // 4th Sunday before Christmas (including that Sunday)
  const advent1 = new Date(christmas);
  advent1.setDate(christmas.getDate() - daysToSunday - 21);
  return advent1;
}

/**
 * Check if we're in Office 2 period (Advent)
 * From Vespers of Advent 1 Sunday until None of Dec 24
 */
function isInOffice2Period(date, hourId, advent1Sunday, christmasEve) {
  const dateValue = toDateValue(date);
  const advent1Value = toDateValue(advent1Sunday);
  const christmasEveValue = toDateValue(christmasEve);

  // Before Advent 1 Sunday - not in Office 2
  if (dateValue < advent1Value) return false;

  // After Christmas Eve - not in Office 2
  if (dateValue > christmasEveValue) return false;

  // On Advent 1 Sunday: only Vespers and Compline are Office 2
  if (dateValue === advent1Value) {
    return isHourAtOrAfter(hourId, "vespers");
  }

  // On Christmas Eve: only hours before Vespers are Office 2 (Matins through None)
  if (dateValue === christmasEveValue) {
    return isHourBefore(hourId, "vespers");
  }

  // Between Advent 1 and Christmas Eve (exclusive) - all hours are Office 2
  return true;
}

/**
 * Check if we're in Office 3 period (Christmas to Purification)
 * From Vespers of Dec 24 until Compline of Feb 2 (Purification of BVM)
 */
function isInOffice3Period(date, hourId, christmasEve, purification) {
  const dateValue = toDateValue(date);
  const christmasEveValue = toDateValue(christmasEve);
  const purificationValue = toDateValue(purification);

  // Before Christmas Eve - not in Office 3
  if (dateValue < christmasEveValue) return false;

  // After Purification - not in Office 3
  if (dateValue > purificationValue) return false;

  // On Christmas Eve: only Vespers and Compline are Office 3
  if (dateValue === christmasEveValue) {
    return isHourAtOrAfter(hourId, "vespers");
  }

  // On Purification: all hours including Compline are Office 3
  if (dateValue === purificationValue) {
    return true;
  }

  // Between Christmas Eve and Purification (exclusive) - all hours are Office 3
  return true;
}

/**
 * Determine which office (1, 2, or 3) to use
 *
 * @param {Date} date - The date to check
 * @param {string} hourId - The hour being prayed (matins, lauds, etc.)
 * @returns {number} - 1, 2, or 3
 */
export function getOffice(date, hourId) {
  const year = date.getFullYear();

  // Key dates for current year
  const advent1Sunday = getFirstSundayOfAdvent(year);
  const christmasEve = new Date(year, 11, 24); // Dec 24
  const purification = new Date(year, 1, 2); // Feb 2

  // For dates in January-February, check if we're in the Christmas period
  // which started in the previous year
  if (date.getMonth() < 2 || (date.getMonth() === 1 && date.getDate() <= 2)) {
    // Check against previous year's Christmas through this year's Purification
    const prevChristmasEve = new Date(year - 1, 11, 24);
    if (isInOffice3Period(date, hourId, prevChristmasEve, purification)) {
      return 3;
    }
  }

  // Check Office 3: Christmas Eve Vespers to Purification Compline
  if (isInOffice3Period(date, hourId, christmasEve, purification)) {
    return 3;
  }

  // Check Office 2: Advent 1 Vespers to Christmas Eve None
  if (isInOffice2Period(date, hourId, advent1Sunday, christmasEve)) {
    return 2;
  }

  // Default to Office 1
  return 1;
}

/**
 * Get the name of the current season/office
 */
export function getOfficeName(office, lang = "en") {
  const names = {
    1: { en: "Ordinary Time", cs: "Mezidobí", la: "Per Annum" },
    2: { en: "Advent", cs: "Advent", la: "Adventus" },
    3: { en: "Christmas", cs: "Vánoce", la: "Nativitas" },
  };
  return names[office]?.[lang] || names[office]?.en || "Unknown";
}

/**
 * Get detailed season info for display
 */
export function getSeasonInfo(date, hourId) {
  const office = getOffice(date, hourId);
  return {
    office,
    name: {
      en: getOfficeName(office, "en"),
      cs: getOfficeName(office, "cs"),
      la: getOfficeName(office, "la"),
    },
  };
}

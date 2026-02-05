/**
 * Date Provider Module
 * Centralized date provider that respects dateOverride for testing
 */

import { getState } from './state.js';

/**
 * Get the current date, respecting any override set for testing
 * @returns {Date}
 */
export function getCurrentDate() {
  const override = getState().dateOverride;
  return override ? new Date(override) : new Date();
}

/**
 * Format a Date for datetime-local input value
 * @param {Date} date
 * @returns {string} YYYY-MM-DDTHH:MM format
 */
export function formatDateForInput(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

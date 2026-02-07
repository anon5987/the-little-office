/**
 * Configuration Loader Module
 * Loads config from config.development.json (dev override) or config.json (default).
 */

const DEFAULTS = { showDatePicker: false };

let cached = null;

/**
 * Load application configuration.
 * Tries config.development.json first, falls back to config.json, then defaults.
 * @returns {Promise<{showDatePicker: boolean}>}
 */
export async function loadConfig() {
  if (cached) return cached;

  try {
    const devRes = await fetch('config.development.json');
    if (devRes.ok) {
      cached = { ...DEFAULTS, ...await devRes.json() };
      return cached;
    }
  } catch (e) { /* dev config not found, fall through */ }

  try {
    const res = await fetch('config.json');
    if (res.ok) {
      cached = { ...DEFAULTS, ...await res.json() };
      return cached;
    }
  } catch (e) { /* config not found */ }

  cached = { ...DEFAULTS };
  return cached;
}

/**
 * Application Constants
 * Centralizes magic numbers, strings, and configuration values
 */

// Rendering configuration
export const RENDER = {
  STAFF_OFFSET: 36,
  STAFF_OFFSET_PRINT: 44,
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 100,
};

// Print configuration
export const PRINT = {
  WIDTH: 900,
  PAGE_WIDTH: 720,
};

// Timing delays (in milliseconds)
export const DELAYS = {
  YIELD: 0,
  JGABC_RETRY: 100,
  FONT_LOAD: 200,
  FONT_FALLBACK: 500,
  IDLE_TIMEOUT: 2000,
  RESIZE_DEBOUNCE: 250,
  SCROLL_SAVE_DEBOUNCE: 250,
};

// CSS classes used in JavaScript
export const CSS_CLASSES = {
  HIDDEN: "hidden",
  LOADING: "loading",
  DARK_MODE: "dark-mode",
  SHOW_TRANSLATIONS: "show-translations",
  ERROR: "error",
};

// Supported languages
export const LANGUAGES = {
  ENGLISH: "en",
  CZECH: "cs",
  LATIN: "la",
};

// Available hours (hours with implemented content)
export const AVAILABLE_HOURS = [
  "vespers",
  "lauds",
  "prime",
  "terce",
  "sext",
  "compline",
];

// Hour order for iteration
export const HOUR_ORDER = [
  "matins",
  "lauds",
  "prime",
  "terce",
  "sext",
  "none",
  "vespers",
  "compline",
];

// Hour name translation keys - maps hour ID to translation key
export const HOUR_NAME_KEYS = {
  matins: "ui-hour-matins",
  lauds: "ui-hour-lauds",
  prime: "ui-hour-prime",
  terce: "ui-hour-terce",
  sext: "ui-hour-sext",
  none: "ui-hour-none",
  vespers: "ui-hour-vespers",
  compline: "ui-hour-compline",
};

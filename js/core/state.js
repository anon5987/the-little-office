/**
 * Global State Module
 * Manages application state (language, season/office, current hour)
 * @see {import('./types.js').AppState}
 */

/** @type {import('./types.js').AppState} */
const state = {
  language: 'en',
  office: 1,           // 1, 2, or 3 (seasonal office)
  officeOverride: null, // null = auto-detect, 1/2/3 = manual override
  currentHour: null,    // 'vespers', 'lauds', etc.
  showTranslations: false,
  darkMode: false,
  dateOverride: null    // ISO string or null (session-only, not persisted)
};

// State change listeners
const listeners = new Set();

// Get current state (read-only copy)
export function getState() {
  return { ...state };
}

// Update state and notify listeners
export function set(key, value) {
  if (state[key] !== value) {
    const oldValue = state[key];
    state[key] = value;
    notifyListeners(key, value, oldValue);
  }
}

// Subscribe to state changes
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Notify all listeners of a state change
function notifyListeners(key, value, oldValue) {
  listeners.forEach(listener => {
    try {
      listener(key, value, oldValue);
    } catch (e) {
      console.error('State listener error:', e);
    }
  });
}

// Initialize state from URL parameters and localStorage
export function initState() {
  // Check URL for language param
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || '');

  // Language from URL or localStorage
  const langParam = urlParams.get('lang') || hashParams.get('lang');
  if (langParam && ['en', 'cs'].includes(langParam)) {
    state.language = langParam;
  } else {
    try {
      const savedLang = localStorage.getItem('little-office-lang');
      if (savedLang && ['en', 'cs'].includes(savedLang)) {
        state.language = savedLang;
      }
    } catch (e) {
      // SecurityError expected in private browsing or iframe contexts
    }
  }

  // Office override from URL
  const officeParam = urlParams.get('office') || hashParams.get('office');
  if (officeParam && ['1', '2', '3'].includes(officeParam)) {
    state.officeOverride = parseInt(officeParam, 10);
    state.office = state.officeOverride;
  }

  try {
    // Show translations from localStorage
    const savedShowTrans = localStorage.getItem('little-office-show-translations');
    if (savedShowTrans === 'true') {
      state.showTranslations = true;
    }

    // Dark mode from localStorage
    const savedDarkMode = localStorage.getItem('little-office-dark-mode');
    if (savedDarkMode === 'true') {
      state.darkMode = true;
    }
  } catch (e) {
    // SecurityError expected in private browsing or iframe contexts
  }

  return state;
}

// Save current state to localStorage
export function saveState() {
  try {
    localStorage.setItem('little-office-lang', state.language);
    localStorage.setItem('little-office-show-translations', state.showTranslations.toString());
    localStorage.setItem('little-office-dark-mode', state.darkMode.toString());
  } catch (e) {
    // SecurityError expected in private browsing or iframe contexts
  }
}

// Subscribe to save state on changes
subscribe((key) => {
  if (key === 'language' || key === 'showTranslations' || key === 'darkMode') {
    saveState();
  }
});

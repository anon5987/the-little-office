/**
 * Router Module
 * Hash-based navigation for GitHub Pages compatibility
 *
 * URL format: #hour?office=N&lang=XX
 * Examples:
 *   #vespers
 *   #lauds?office=2
 *   #compline?lang=cs
 */

// Valid hour identifiers
export const HOURS = ['matins', 'lauds', 'prime', 'terce', 'sext', 'none', 'vespers', 'compline'];

// Route change listeners
const listeners = new Set();

// Current route state
let currentRoute = {
  hour: null,
  params: {}
};

/**
 * Parse the current URL hash into route info
 */
export function parseHash() {
  const hash = window.location.hash.slice(1); // Remove #
  if (!hash) {
    return { hour: null, params: {} };
  }

  const [path, queryString] = hash.split('?');
  const params = {};

  if (queryString) {
    const searchParams = new URLSearchParams(queryString);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
  }

  const hour = path.toLowerCase();
  if (HOURS.includes(hour)) {
    return { hour, params };
  }

  // Invalid hour - return null
  return { hour: null, params };
}

/**
 * Navigate to a specific hour
 */
export function navigate(hour, options = {}) {
  if (!HOURS.includes(hour)) {
    console.error(`Invalid hour: ${hour}`);
    return;
  }

  const params = new URLSearchParams();
  if (options.office) params.set('office', options.office);
  if (options.lang) params.set('lang', options.lang);

  const queryString = params.toString();
  window.location.hash = queryString ? `${hour}?${queryString}` : hour;
}

/**
 * Check if on landing page (no hour selected)
 */
export function isLandingPage() {
  return currentRoute.hour === null;
}

/**
 * Subscribe to route changes
 */
export function onRouteChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Handle route changes
 */
function handleRouteChange() {
  const newRoute = parseHash();
  const oldRoute = currentRoute;

  // Only notify if route actually changed
  if (newRoute.hour !== oldRoute.hour ||
      JSON.stringify(newRoute.params) !== JSON.stringify(oldRoute.params)) {
    currentRoute = newRoute;
    listeners.forEach(listener => {
      try {
        listener(newRoute, oldRoute);
      } catch (e) {
        console.error('Route listener error:', e);
      }
    });
  }
}

/**
 * Initialize the router
 */
export function initRouter() {
  // Set initial route
  currentRoute = parseHash();

  // Listen for hash changes
  window.addEventListener('hashchange', handleRouteChange);

  // Return current route
  return currentRoute;
}

/**
 * Build a URL for a given hour and options
 */
export function buildUrl(hour, options = {}) {
  const params = new URLSearchParams();
  if (options.office) params.set('office', options.office);
  if (options.lang) params.set('lang', options.lang);

  const queryString = params.toString();
  return queryString ? `#${hour}?${queryString}` : `#${hour}`;
}

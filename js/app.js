/**
 * Main Application Entry Point (ES Module)
 *
 * This module orchestrates the Little Office application.
 * Load this as: <script type="module" src="js/app.js"></script>
 */

import { initRenderer, handleResize, renderAllGabc, waitForJgabc } from './renderer.js';
import { initPrint } from './print.js';
import {
  initTranslations,
  updateUITranslations,
  updateChantTranslations,
} from './translation-manager.js';
import { initState, getState, set, subscribe } from './state.js';
import {
  initRouter,
  onRouteChange,
  isLandingPage,
  navigate,
  HOURS,
} from './router.js';
import { getOffice, getOfficeName } from './season.js';
import { getCurrentHour, getRecommendation } from './hour-time.js';
import { cancelRender } from './hour-renderer.js';

// Split modules
import { detectIOS } from './device-detection.js';
import { fixStaticSVGWhitespace } from './svg-utils.js';
import { initStickyHeader, setUITranslations } from './sticky-header.js';
import { renderLandingPage, setTranslationsCache as setLandingTranslations } from './landing-page.js';
import { renderHourPage, hideHourContent, setTranslationsCache as setHourTranslations } from './hour-page.js';
import { IDS, getElement, SELECTORS } from './selectors.js';
import { initScrollTracking, clearScrollPosition, clearScrollHour } from './scroll-position.js';

// Application state
const app = {
  initialized: false,
  currentView: null, // 'landing' or hour ID
  translations: null,
};

/**
 * Load common translations for use in landing/hour pages
 */
async function loadCommonTranslations() {
  try {
    const common = await import('../data/translations/common.js');
    const translations = common.commonTranslations || common.default;
    setLandingTranslations(translations);
    setHourTranslations(translations);
    return translations;
  } catch (e) {
    console.warn('Could not load common translations:', e);
    return null;
  }
}

/**
 * Handle route changes
 */
function handleRouteChange(newRoute, oldRoute) {
  console.log('Route changed:', oldRoute, '->', newRoute);

  // Cancel any in-progress rendering when navigating
  cancelRender();

  // Clear scroll position on intentional navigation
  clearScrollPosition();
  clearScrollHour();

  if (isLandingPage()) {
    app.currentView = renderLandingPage();
    hideHourContent();
  } else {
    renderHourPage(newRoute.hour, newRoute.params).then((view) => {
      app.currentView = view;
    });
  }
}

/**
 * Initialize the application
 */
export async function init(translations) {
  if (app.initialized) return;

  app.translations = translations;

  // Detect iOS for rendering fixes
  detectIOS();

  // Fix static SVG whitespace
  fixStaticSVGWhitespace();

  // Initialize state from URL/localStorage
  initState();

  // Load common translations for page rendering
  const commonTranslations = await loadCommonTranslations();

  // Initialize sticky header controls and set UI translations
  initStickyHeader();
  if (commonTranslations) {
    setUITranslations(commonTranslations);
    // Apply initial UI translations for header menu
    const state = getState();
    updateUITranslations(commonTranslations, state.language || 'en');
  }

  // Initialize scroll position tracking
  initScrollTracking();

  // Initialize print handlers
  initPrint();

  // Initialize router and listen for changes
  const initialRoute = initRouter();
  onRouteChange(handleRouteChange);

  // Initialize translations if available
  if (translations) {
    initTranslations(translations);
  }

  // Set up resize handler
  window.addEventListener('resize', handleResize);

  // Handle initial route
  if (isLandingPage()) {
    // Check if we have landing page elements
    const hasLandingElements =
      document.querySelector(SELECTORS.LANDING_PAGE) ||
      getElement(IDS.APP_CONTENT);
    if (hasLandingElements) {
      app.currentView = renderLandingPage();
    }
  } else {
    // Render the hour
    app.currentView = await renderHourPage(initialRoute.hour, initialRoute.params);
  }

  // Initialize GABC rendering (extends staff lines after fonts load)
  initRenderer();

  app.initialized = true;
  console.log('Little Office app initialized');
}

// Re-export for direct use
export { renderAllGabc, waitForJgabc };
export { updateUITranslations, updateChantTranslations };
export { getState, set, subscribe };
export { navigate, HOURS };
export { getOffice, getOfficeName };
export { getCurrentHour, getRecommendation };

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize with global translations if available, otherwise initialize without
  const globalTranslations =
    typeof translations !== 'undefined' ? translations : null;
  init(globalTranslations);
});

// Export app object for debugging
export { app };

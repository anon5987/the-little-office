/**
 * Main Application Entry Point (ES Module)
 *
 * This module orchestrates the Little Office application.
 * Load this as: <script type="module" src="js/app.js"></script>
 */

import { initRenderer, handleResize, renderAllGabc, waitForJgabc } from './rendering/renderer.js';
import { initPrint } from './rendering/print.js';
import {
  initTranslations,
  updateUITranslations,
  updateChantTranslations,
} from './ui/translation-manager.js';
import { initState, getState, set, subscribe } from './core/state.js';
import {
  initRouter,
  onRouteChange,
  isLandingPage,
  navigate,
  HOURS,
} from './core/router.js';
import { getOffice, getOfficeName } from './liturgical/season.js';
import { getCurrentHour, getRecommendation } from './liturgical/hour-time.js';
import { cancelRender } from './rendering/hour-renderer.js';

// Split modules
import { detectIOS } from './utils/device-detection.js';
import { fixStaticSVGWhitespace } from './utils/svg-utils.js';
import { initStickyHeader, setUITranslations } from './ui/sticky-header.js';
import { renderLandingPage, setTranslationsCache as setLandingTranslations } from './pages/landing-page.js';
import { renderHourPage, hideHourContent, setTranslationsCache as setHourTranslations } from './pages/hour-page.js';
import { IDS, getElement, SELECTORS } from './utils/selectors.js';
import { initScrollTracking, clearScrollPosition, clearScrollHour } from './ui/scroll-position.js';

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
 * Handle date override changes - re-render current view
 */
function handleDateOverrideChange() {
  // Cancel any in-progress rendering
  cancelRender();

  if (isLandingPage()) {
    app.currentView = renderLandingPage();
  } else {
    // Re-render the current hour page with new date
    const currentRoute = initRouter();
    renderHourPage(currentRoute.hour, currentRoute.params).then((view) => {
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

  // Subscribe to date override changes
  subscribe((key) => {
    if (key === 'dateOverride') {
      handleDateOverrideChange();
    }
  });

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

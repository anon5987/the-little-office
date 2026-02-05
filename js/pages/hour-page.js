/**
 * Hour Page Module
 * Renders and manages individual hour pages
 */

import { IDS, getElement } from '../utils/selectors.js';
import { CSS_CLASSES } from '../core/constants.js';
import { getState } from '../core/state.js';
import { showStickyHeader, updateLanguageSelector, setCurrentHourData, clearCurrentHourData } from '../ui/sticky-header.js';
import { getOffice } from '../liturgical/season.js';
import { getCurrentDate } from '../core/date-provider.js';
import { renderHour, applyTranslations } from '../rendering/hour-renderer.js';
import { cleanupScope, SCOPES } from '../utils/event-manager.js';
import { restoreScrollPosition, setScrollHour } from '../ui/scroll-position.js';
import {
  setTranslationsCache as setTranslationsCacheInternal,
  getHourNameTranslated,
} from '../utils/translation-helpers.js';

/**
 * Display an error message in a container element
 */
function showError(container, message) {
  const p = document.createElement('p');
  p.className = 'error';
  p.textContent = message;
  container.innerHTML = '';
  container.appendChild(p);
}

/**
 * Set translations cache for hour names
 * @param {Object} translations - Translation data
 */
export function setTranslationsCache(translations) {
  setTranslationsCacheInternal(translations);
}

/**
 * Render an hour page dynamically from data modules
 * @param {string} hourId - Hour identifier (e.g., 'vespers')
 * @param {Object} params - Route parameters
 * @returns {Promise<string>} View identifier
 */
export async function renderHourPage(hourId, params = {}) {
  // Clean up landing page events
  cleanupScope(SCOPES.LANDING_PAGE);

  const state = getState();
  const office = params.office
    ? parseInt(params.office, 10)
    : getOffice(getCurrentDate(), hourId);
  const lang = params.lang || state.language || 'en';

  // Hide landing page / app content
  const appContent = getElement(IDS.APP_CONTENT);
  if (appContent) {
    appContent.classList.add(CSS_CLASSES.HIDDEN);
  }

  // Get or create hour content container
  let hourContent = getElement(IDS.HOUR_CONTENT);
  if (!hourContent) {
    hourContent = document.createElement('div');
    hourContent.id = IDS.HOUR_CONTENT;
    document.body.appendChild(hourContent);
  }

  // Get or create content area
  let contentArea = hourContent.querySelector(`#${IDS.HOUR_CONTENT_AREA}`);
  if (!contentArea) {
    contentArea = document.createElement('div');
    contentArea.id = IDS.HOUR_CONTENT_AREA;
    hourContent.appendChild(contentArea);
  }

  // Clear old content before showing container (prevents flash of stale content)
  contentArea.innerHTML = '';

  // Now safe to show the container
  hourContent.classList.remove(CSS_CLASSES.HIDDEN);

  // Show sticky header with hour name
  const hourName = getHourNameTranslated(hourId, lang);
  showStickyHeader(hourName, hourId);

  // Update language selector to match current language
  updateLanguageSelector(lang);

  // Render the hour from data modules
  try {
    const hourData = await renderHour(hourId, contentArea, { office, lang });
    // Store hour data for language switching
    setCurrentHourData(hourData, applyTranslations);
    // Restore scroll position after rendering completes (heights are stable)
    restoreScrollPosition(hourId);
    // Enable scroll tracking
    setScrollHour(hourId);
  } catch (e) {
    console.error('Failed to render hour:', e);
    showError(contentArea, `Failed to load ${hourId}. ${e.message}`);
    clearCurrentHourData();
  }

  return hourId;
}

/**
 * Hide hour content (used when navigating back to landing)
 */
export function hideHourContent() {
  const hourContent = getElement(IDS.HOUR_CONTENT);
  if (hourContent) {
    hourContent.classList.add(CSS_CLASSES.HIDDEN);
  }
  clearCurrentHourData();
}

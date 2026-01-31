/**
 * Landing Page Module
 * Renders and manages the hour selection landing page
 */

import { IDS, SELECTORS, getElement } from './selectors.js';
import { getState, set } from './state.js';
import { CSS_CLASSES, AVAILABLE_HOURS, HOUR_NAME_KEYS } from './constants.js';
import { createEventScope, SCOPES } from './event-manager.js';
import { hideStickyHeader } from './sticky-header.js';
import { getSeasonInfo } from './season.js';
import { getAllHoursStatus } from './hour-time.js';
import { buildUrl } from './router.js';

// Translation cache for hour names
let translationsCache = null;

/**
 * Set translations cache for hour names
 * @param {Object} translations - Translation data
 */
export function setTranslationsCache(translations) {
  translationsCache = translations;
}

/**
 * Get hour name from translations or fallback to hour-time module
 * @param {string} hourId - Hour identifier
 * @param {string} lang - Language code
 * @returns {string}
 */
function getHourNameTranslated(hourId, lang) {
  const key = HOUR_NAME_KEYS[hourId];
  if (translationsCache && key && translationsCache[key]) {
    return translationsCache[key][lang] || translationsCache[key].en || hourId;
  }
  // Fallback to capitalized ID
  return hourId.charAt(0).toUpperCase() + hourId.slice(1);
}

/**
 * Render the landing page with hour selection grid
 * @returns {string} View identifier
 */
export function renderLandingPage() {
  // Clean up previous event listeners
  const events = createEventScope(SCOPES.LANDING_PAGE);

  // Hide sticky header on landing page
  hideStickyHeader();

  // Show app-content
  const appContent = getElement(IDS.APP_CONTENT);
  if (appContent) {
    appContent.style.display = 'block';
  }

  const container = appContent || document.body;
  const state = getState();
  const lang = state.language || 'en';
  const seasonInfo = getSeasonInfo(new Date(), 'vespers');
  const hoursStatus = getAllHoursStatus();

  const html = `
    <div class="landing-page">
      <h1 class="landing-title">
        ${lang === 'cs' ? 'Malé oficium blahoslavené Panny Marie' : 'The Little Office of the Blessed Virgin Mary'}
      </h1>

      <div class="season-info">
        <span class="season-label">${lang === 'cs' ? 'Období' : 'Season'}:</span>
        <span class="season-name">${seasonInfo.name[lang]} (${lang === 'cs' ? 'Oficium' : 'Office'} ${seasonInfo.office})</span>
      </div>

      <div class="hours-grid">
        ${hoursStatus
          .map((hour) => {
            const available = AVAILABLE_HOURS.includes(hour.id);
            const classes = [
              'hour-card',
              hour.isPrimary && available ? 'recommended' : '',
              hour.isSecondary && available ? 'secondary' : '',
              !available ? 'disabled' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return `
            <a href="${available ? buildUrl(hour.id) : '#'}" class="${classes}">
              <span class="hour-name">${getHourNameTranslated(hour.id, lang)}</span>
              <span class="hour-latin">${getHourNameTranslated(hour.id, 'la')}</span>
              ${hour.isPrimary && available ? `<span class="badge">${lang === 'cs' ? 'Doporučeno' : 'Recommended'}</span>` : ''}
              ${!available ? `<span class="badge coming-soon">${lang === 'cs' ? 'Brzy' : 'Soon'}</span>` : ''}
            </a>
          `;
          })
          .join('')}
      </div>

      <div class="landing-controls">
        <select id="${IDS.LANDING_LANGUAGE_SELECTOR}" class="control-select">
          <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
          <option value="cs" ${lang === 'cs' ? 'selected' : ''}>Čeština</option>
        </select>
        <button id="${IDS.LANDING_DARK_MODE}" class="control-btn" title="${lang === 'cs' ? 'Tmavý režim' : 'Dark mode'}">
          ${state.darkMode ? '🌙' : '☀️'}
        </button>
      </div>
    </div>
  `;

  // Set the HTML content
  if (container !== document.body) {
    container.innerHTML = html;
  } else {
    const existing = document.querySelector(SELECTORS.LANDING_PAGE);
    if (existing) {
      existing.outerHTML = html;
    }
  }

  // Set up language selector handler
  const langSelector = getElement(IDS.LANDING_LANGUAGE_SELECTOR);
  if (langSelector) {
    events.add(langSelector, 'change', (e) => {
      set('language', e.target.value);
      renderLandingPage();
    });
  }

  // Set up dark mode toggle
  const darkModeBtn = getElement(IDS.LANDING_DARK_MODE);
  if (darkModeBtn) {
    events.add(darkModeBtn, 'click', () => {
      const isDark = !getState().darkMode;
      set('darkMode', isDark);
      document.body.classList.toggle(CSS_CLASSES.DARK_MODE, isDark);
      // Update checkbox in header menu if exists
      const headerCheckbox = getElement(IDS.DARK_MODE_CHECKBOX);
      if (headerCheckbox) headerCheckbox.checked = isDark;
      renderLandingPage();
    });
  }

  return 'landing';
}

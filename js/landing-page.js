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
 * Get translation by key
 * @param {string} key - Translation key
 * @param {string} lang - Language code
 * @returns {string}
 */
function t(key, lang) {
  if (translationsCache && translationsCache[key]) {
    return translationsCache[key][lang] || translationsCache[key].en || key;
  }
  return key;
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
        ${t('ui-landing-title', lang)}
      </h1>

      <div class="season-info">
        <span class="season-label">${t('ui-landing-season', lang)}:</span>
        <span class="season-name">${seasonInfo.name[lang]} (${t('ui-landing-office', lang)} ${seasonInfo.office})</span>
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
              ${hour.isPrimary && available ? `<span class="badge">${t('ui-landing-recommended', lang)}</span>` : ''}
              ${!available ? `<span class="badge coming-soon">${t('ui-landing-soon', lang)}</span>` : ''}
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
        <button id="${IDS.LANDING_DARK_MODE}" class="control-btn" title="${t('ui-landing-dark-mode', lang)}">
          ${state.darkMode ? '🌙' : '☀️'}
        </button>
      </div>

      <div class="implementation-plan">
        <h2 class="plan-title">${t('ui-implementation-plan', lang)}</h2>
        <ol class="plan-list">
          <li><s>${getHourNameTranslated('vespers', lang)}</s></li>
          <li><s>${getHourNameTranslated('lauds', lang)}</s></li>
          <li>${getHourNameTranslated('compline', lang)}</li>
          <li>${getHourNameTranslated('prime', lang)}</li>
          <li>${getHourNameTranslated('terce', lang)}</li>
          <li>${getHourNameTranslated('sext', lang)}</li>
          <li>${getHourNameTranslated('none', lang)}</li>
          <li>
            ${t('ui-seasonal-variations', lang)}
            <span class="plan-note">(${t('ui-seasonal-variations-note', lang)})</span>
          </li>
          <li>${getHourNameTranslated('matins', lang)}</li>
        </ol>
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

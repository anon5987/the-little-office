/**
 * Main Application Entry Point (ES Module)
 *
 * This module orchestrates the Little Office application.
 * Load this as: <script type="module" src="js/app.js"></script>
 */

import {
  initRenderer,
  handleResize,
  renderAllGabc,
  waitForJgabc,
} from "./renderer.js";
import { initPrint } from "./print.js";
import {
  initTranslations,
  updateUITranslations,
  updateChantTranslations,
} from "./translation-manager.js";
import { initState, getState, set, subscribe } from "./state.js";
import {
  initRouter,
  onRouteChange,
  isLandingPage,
  getRoute,
  navigate,
  HOURS,
  buildUrl,
} from "./router.js";
import { getOffice, getOfficeName, getSeasonInfo } from "./season.js";
import {
  getCurrentHour,
  getRecommendation,
  getHourName,
  getHourDescription,
  getAllHoursStatus,
} from "./hour-time.js";
import {
  renderHour,
  applyTranslations,
  loadTranslations,
  cancelRender,
} from "./hour-renderer.js";

// Global reference to translations (loaded separately or dynamically)
let translationsData = null;

// Application state
const app = {
  initialized: false,
  currentView: null, // 'landing' or hour ID
  translations: null,
};

/**
 * Detect iOS for rendering fixes
 */
function detectIOS() {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS) {
    document.documentElement.classList.add("ios-device");
  }
}

/**
 * Fix whitespace issues in static SVG text elements
 */
function fixStaticSVGWhitespace() {
  document.querySelectorAll("tspan.rubric").forEach(function (tspan) {
    tspan.textContent = tspan.textContent.trim();
  });
  document.querySelectorAll("svg text").forEach(function (textEl) {
    Array.from(textEl.childNodes).forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === "") {
        textEl.removeChild(node);
      }
    });
  });
}

/**
 * Initialize dark mode toggle and apply saved preference
 */
function initDarkMode() {
  const state = getState();
  const toggle = document.getElementById("dark-mode-toggle");

  // Apply saved dark mode state
  if (state.darkMode) {
    document.body.classList.add("dark-mode");
    updateDarkModeIcon(true);
  }

  // Set up toggle button
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark-mode");
      set("darkMode", isDark);
      updateDarkModeIcon(isDark);
    });
  }
}

/**
 * Update dark mode toggle icon
 */
function updateDarkModeIcon(isDark) {
  const toggle = document.getElementById("dark-mode-toggle");
  if (!toggle) return;

  const lightIcon = toggle.querySelector(".light-icon");
  const darkIcon = toggle.querySelector(".dark-icon");

  if (lightIcon && darkIcon) {
    lightIcon.style.display = isDark ? "none" : "inline";
    darkIcon.style.display = isDark ? "inline" : "none";
  }
}

// Hours that have content implemented
const AVAILABLE_HOURS = ["vespers"];

/**
 * Render the landing page with hour selection grid
 */
function renderLandingPage() {
  const container = document.getElementById("app-content") || document.body;
  const state = getState();
  const lang = state.language || "en";
  const seasonInfo = getSeasonInfo(new Date(), "vespers");
  const hoursStatus = getAllHoursStatus();

  const html = `
    <div class="landing-page">
      <h1 class="landing-title">
        ${lang === "cs" ? "Malé oficium blahoslavené Panny Marie" : "The Little Office of the Blessed Virgin Mary"}
      </h1>

      <div class="season-info">
        <span class="season-label">${lang === "cs" ? "Období" : "Season"}:</span>
        <span class="season-name">${seasonInfo.name[lang]} (${lang === "cs" ? "Oficium" : "Office"} ${seasonInfo.office})</span>
      </div>

      <div class="hours-grid">
        ${hoursStatus
          .map((hour) => {
            const available = AVAILABLE_HOURS.includes(hour.id);
            const classes = [
              "hour-card",
              hour.isPrimary && available ? "recommended" : "",
              hour.isSecondary && available ? "secondary" : "",
              !available ? "disabled" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return `
            <a href="${available ? buildUrl(hour.id) : "#"}" class="${classes}">
              <span class="hour-name">${getHourName(hour.id, lang)}</span>
              <span class="hour-latin">${getHourName(hour.id, "la")}</span>
              ${hour.isPrimary && available ? `<span class="badge">${lang === "cs" ? "Doporučeno" : "Recommended"}</span>` : ""}
              ${!available ? `<span class="badge coming-soon">${lang === "cs" ? "Brzy" : "Soon"}</span>` : ""}
            </a>
          `;
          })
          .join("")}
      </div>

      <div class="landing-footer">
        <label class="language-selector">
          <select id="landing-language-selector">
            <option value="en" ${lang === "en" ? "selected" : ""}>English</option>
            <option value="cs" ${lang === "cs" ? "selected" : ""}>Čeština</option>
          </select>
        </label>
      </div>
    </div>
  `;

  // Check if we have a dedicated container or need to manage the whole page
  const appContent = document.getElementById("app-content");
  if (appContent) {
    appContent.innerHTML = html;
  } else {
    // For full page mode, we need to be more careful
    const existing = document.querySelector(".landing-page");
    if (existing) {
      existing.outerHTML = html;
    }
  }

  // Set up language selector handler
  const langSelector = document.getElementById("landing-language-selector");
  if (langSelector) {
    langSelector.addEventListener("change", (e) => {
      set("language", e.target.value);
      renderLandingPage(); // Re-render with new language
    });
  }

  app.currentView = "landing";
}

// Store current hour data for language switching without re-render
let currentHourData = null;

/**
 * Render an hour page dynamically from data modules
 */
async function renderHourPage(hourId, params = {}) {
  const state = getState();
  const office = params.office
    ? parseInt(params.office, 10)
    : getOffice(new Date(), hourId);
  const lang = params.lang || state.language || "en";

  console.log(`Rendering ${hourId} with Office ${office}, Language ${lang}`);

  // Hide landing page
  const landingContent = document.querySelector(".landing-page");
  if (landingContent) {
    landingContent.style.display = "none";
  }

  // Get or create hour content container
  let hourContent = document.getElementById("hour-content");
  if (!hourContent) {
    hourContent = document.createElement("div");
    hourContent.id = "hour-content";
    document.body.appendChild(hourContent);
  }
  hourContent.style.display = "block";

  // Add controls if not present
  let controls = hourContent.querySelector("#controls");
  if (!controls) {
    controls = document.createElement("div");
    controls.id = "controls";
    controls.className = "hide-print";
    controls.innerHTML = `
      <a href="#" class="back-link">&larr; ${lang === "cs" ? "Zpět" : "Back"}</a>
      <select id="language-selector">
        <option value="en" ${lang === "en" ? "selected" : ""}>English</option>
        <option value="cs" ${lang === "cs" ? "selected" : ""}>Čeština</option>
      </select>
      <label>
        <input type="checkbox" id="show-translations" />
        <span data-translation-key="ui-show-chant-translations">Show chant translations</span>
      </label>
    `;
    hourContent.insertBefore(controls, hourContent.firstChild);

    // Set up language selector
    const langSelector = controls.querySelector("#language-selector");
    langSelector.addEventListener("change", (e) => {
      const newLang = e.target.value;
      set("language", newLang);

      // Just update translations without re-rendering GABC
      if (currentHourData && currentHourData.translations) {
        const contentArea = document.getElementById("hour-content-area");
        if (contentArea) {
          applyTranslations(contentArea, currentHourData.translations, newLang);
          // Also update the back link text
          const backLink = controls.querySelector(".back-link");
          if (backLink) {
            backLink.innerHTML = `&larr; ${newLang === "cs" ? "Zpět" : "Back"}`;
          }
        }
      }
    });

    // Set up translations checkbox
    const checkbox = controls.querySelector("#show-translations");
    // Restore saved state
    const savedShowTrans = getState().showTranslations;
    checkbox.checked = savedShowTrans;
    document.body.classList.toggle("show-translations", savedShowTrans);

    checkbox.addEventListener("change", () => {
      set("showTranslations", checkbox.checked);
      document.body.classList.toggle("show-translations", checkbox.checked);
    });
  }

  // Get or create content area (after controls)
  let contentArea = hourContent.querySelector("#hour-content-area");
  if (!contentArea) {
    contentArea = document.createElement("div");
    contentArea.id = "hour-content-area";
    hourContent.appendChild(contentArea);
  }

  // Render the hour from data modules
  try {
    currentHourData = await renderHour(hourId, contentArea, { office, lang });
  } catch (e) {
    console.error("Failed to render hour:", e);
    contentArea.innerHTML = `<p class="error">Failed to load ${hourId}. ${e.message}</p>`;
    currentHourData = null;
  }

  app.currentView = hourId;
}

/**
 * Handle route changes
 */
function handleRouteChange(newRoute, oldRoute) {
  console.log("Route changed:", oldRoute, "->", newRoute);

  // Cancel any in-progress rendering when navigating
  cancelRender();

  if (isLandingPage()) {
    renderLandingPage();

    // Hide hour content if visible
    const hourContent = document.getElementById("hour-content");
    if (hourContent) {
      hourContent.style.display = "none";
    }
  } else {
    renderHourPage(newRoute.hour, newRoute.params);
  }
}

/**
 * Initialize the application
 */
export async function init(translations) {
  if (app.initialized) return;

  translationsData = translations;
  app.translations = translations;

  // Detect iOS
  detectIOS();

  // Fix static SVG whitespace
  fixStaticSVGWhitespace();

  // Initialize state from URL/localStorage
  initState();

  // Initialize dark mode
  initDarkMode();

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
  window.addEventListener("resize", handleResize);

  // Handle initial route
  if (isLandingPage()) {
    // Check if we have landing page elements
    const hasLandingElements =
      document.querySelector(".landing-page") ||
      document.getElementById("app-content");
    if (hasLandingElements) {
      renderLandingPage();
    }
  } else {
    // Render the hour
    await renderHourPage(initialRoute.hour, initialRoute.params);
  }

  // Initialize GABC rendering for current view
  initRenderer();

  app.initialized = true;
  console.log("Little Office app initialized");
}

// Re-export for direct use
export { renderAllGabc, waitForJgabc };
export { updateUITranslations, updateChantTranslations };
export { getState, set, subscribe };
export { navigate, HOURS };
export { getOffice, getOfficeName };
export { getCurrentHour, getRecommendation };

// Auto-initialize on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize with global translations if available, otherwise initialize without
  const globalTranslations =
    typeof translations !== "undefined" ? translations : null;
  init(globalTranslations);
});

// Export app object for debugging
export { app };

/**
 * Scroll Position Module
 * Saves and restores scroll position for hour pages using anchor-based approach
 */

import { DELAYS } from './constants.js';
import { IDS, SELECTORS } from './selectors.js';

const STORAGE_KEY = 'scrollPosition';
const HIGHLIGHT_CLASS = 'scroll-highlight';

/**
 * @typedef {Object} ScrollState
 * @property {string} hourId - Hour identifier to validate on restore
 * @property {string} anchorId - Section wrapper ID
 * @property {number} offsetRatio - Position within section (0-1)
 */

/**
 * Get the topmost visible section in the viewport
 * @returns {{element: HTMLElement, offsetRatio: number}|null}
 */
function getTopmostVisibleSection() {
  const contentArea = document.getElementById(IDS.HOUR_CONTENT_AREA);
  if (!contentArea) return null;

  const sections = contentArea.querySelectorAll(SELECTORS.HOUR_SECTIONS);
  if (!sections.length) return null;

  const viewportTop = window.scrollY;

  // Find the section that contains the current scroll position
  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const sectionBottom = sectionTop + rect.height;

    // Check if viewport top is within this section
    if (viewportTop >= sectionTop && viewportTop < sectionBottom) {
      const offsetRatio = (viewportTop - sectionTop) / rect.height;
      return { element: section, offsetRatio: Math.min(1, Math.max(0, offsetRatio)) };
    }

    // If this section is below viewport top, the previous section was the last visible
    if (sectionTop > viewportTop) {
      // Use this section if we're close to its top
      if (sectionTop - viewportTop < 50) {
        return { element: section, offsetRatio: 0 };
      }
      break;
    }
  }

  // If we're past all sections, return the last one
  const lastSection = sections[sections.length - 1];
  if (lastSection) {
    const rect = lastSection.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    if (viewportTop >= sectionTop) {
      const offsetRatio = (viewportTop - sectionTop) / rect.height;
      return { element: lastSection, offsetRatio: Math.min(1, Math.max(0, offsetRatio)) };
    }
  }

  // Default to first section
  const firstSection = sections[0];
  return firstSection ? { element: firstSection, offsetRatio: 0 } : null;
}

/**
 * Save current scroll position to sessionStorage
 * @param {string} hourId - Current hour identifier
 */
function saveScrollPosition(hourId) {
  if (!hourId) return;

  try {
    const visible = getTopmostVisibleSection();
    if (!visible || !visible.element.id) return;

    /** @type {ScrollState} */
    const state = {
      hourId,
      anchorId: visible.element.id,
      offsetRatio: visible.offsetRatio,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // sessionStorage may be unavailable
  }
}

/**
 * Highlight a section with animated background
 * @param {HTMLElement} element - Element to highlight
 */
function highlightSection(element) {
  // Remove any existing highlight
  element.classList.remove(HIGHLIGHT_CLASS);

  // Force reflow to restart animation if already applied
  void element.offsetWidth;

  // Add highlight class
  element.classList.add(HIGHLIGHT_CLASS);

  // Remove class after animation completes
  element.addEventListener('animationend', () => {
    element.classList.remove(HIGHLIGHT_CLASS);
  }, { once: true });
}

/**
 * Restore scroll position after rendering completes
 * @param {string} hourId - Hour being rendered
 */
export function restoreScrollPosition(hourId) {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    /** @type {ScrollState} */
    const state = JSON.parse(stored);

    // Validate same hour
    if (state.hourId !== hourId) {
      clearScrollPosition();
      return;
    }

    const anchor = document.getElementById(state.anchorId);
    if (!anchor) {
      console.warn('Scroll anchor not found:', state.anchorId);
      clearScrollPosition();
      return;
    }

    // Skip if restoring to first section (already at top)
    const contentArea = document.getElementById(IDS.HOUR_CONTENT_AREA);
    const firstSection = contentArea?.querySelector(SELECTORS.HOUR_SECTIONS);
    if (firstSection && anchor === firstSection && state.offsetRatio < 0.1) {
      clearScrollPosition();
      return;
    }

    // Scroll so section top is ~100px below viewport top
    const anchorTop = anchor.getBoundingClientRect().top + window.scrollY;
    const scrollTarget = Math.max(0, anchorTop - 100);

    // Instant scroll to restored position (smooth would delay after render wait)
    window.scrollTo({ top: scrollTarget, behavior: 'instant' });

    // Highlight the section after scroll completes
    highlightSection(anchor);

    // Clear after successful restore
    clearScrollPosition();
  } catch (e) {
    // JSON parse error or sessionStorage unavailable
    clearScrollPosition();
  }
}

/**
 * Clear saved scroll position
 */
export function clearScrollPosition() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // sessionStorage may be unavailable
  }
}

// Module state for tracking
let currentHourId = null;
let scrollTimeout = null;

/**
 * Handle scroll events with debouncing
 */
function handleScroll() {
  if (!currentHourId) return;

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    saveScrollPosition(currentHourId);
  }, DELAYS.SCROLL_SAVE_DEBOUNCE);
}

/**
 * Handle beforeunload to ensure position is saved
 */
function handleBeforeUnload() {
  if (currentHourId) {
    saveScrollPosition(currentHourId);
  }
}

/**
 * Initialize scroll tracking for hour pages
 */
export function initScrollTracking() {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('beforeunload', handleBeforeUnload);
}

/**
 * Set the current hour being viewed (enables scroll tracking)
 * @param {string} hourId - Hour identifier
 */
export function setScrollHour(hourId) {
  currentHourId = hourId;
}

/**
 * Clear the current hour (disables scroll tracking)
 */
export function clearScrollHour() {
  currentHourId = null;
}

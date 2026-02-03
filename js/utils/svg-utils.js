/**
 * SVG Utilities Module
 * Helpers for SVG manipulation and fixes
 */

import { SELECTORS } from './selectors.js';

/**
 * Fix whitespace issues in static SVG text elements
 * Removes empty text nodes and trims rubric content
 */
export function fixStaticSVGWhitespace() {
  // Trim rubric text content
  document.querySelectorAll(SELECTORS.TSPAN_RUBRIC).forEach((tspan) => {
    tspan.textContent = tspan.textContent.trim();
  });

  // Remove empty text nodes from SVG text elements
  document.querySelectorAll(SELECTORS.SVG_TEXT).forEach((textEl) => {
    Array.from(textEl.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') {
        textEl.removeChild(node);
      }
    });
  });
}

/**
 * jgabc Library Adapter Module
 * Encapsulates all jgabc library interactions with safe wrappers
 *
 * jgabc exposes global functions: getChant, relayoutChant, getHeader, _defs, staffoffset, svgWidth
 */

import { RENDER, DELAYS } from '../core/constants.js';

/**
 * Check if jgabc library is loaded and ready
 * @returns {boolean}
 */
export function isJgabcReady() {
  return (
    typeof $ !== 'undefined' &&
    typeof getChant === 'function' &&
    typeof _defs !== 'undefined'
  );
}

/**
 * Wait for jgabc library to be ready
 * @returns {Promise<void>}
 */
export function waitForJgabcReady() {
  const MAX_ATTEMPTS = 100;
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      if (isJgabcReady()) {
        resolve();
      } else if (++attempts >= MAX_ATTEMPTS) {
        reject(new Error('jgabc library failed to load after ' + (MAX_ATTEMPTS * DELAYS.JGABC_RETRY / 1000) + 's'));
      } else {
        setTimeout(check, DELAYS.JGABC_RETRY);
      }
    };
    check();
  });
}

/**
 * Wait for jgabc with callback (legacy API)
 * @param {Function} callback - Function to call when ready
 */
export function waitForJgabc(callback, _attempts = 0) {
  const MAX_ATTEMPTS = 100;
  if (isJgabcReady()) {
    if (callback) callback();
  } else if (_attempts >= MAX_ATTEMPTS) {
    console.error('jgabc library failed to load after ' + (MAX_ATTEMPTS * DELAYS.JGABC_RETRY / 1000) + 's');
  } else {
    setTimeout(() => waitForJgabc(callback, _attempts + 1), DELAYS.JGABC_RETRY);
  }
}

/**
 * Get the staff offset value
 * @returns {number}
 */
export function getStaffOffset() {
  return typeof staffoffset !== 'undefined' ? staffoffset : RENDER.STAFF_OFFSET;
}

/**
 * Get the SVG defs element clone
 * @returns {Node|null}
 */
export function getDefsSafe() {
  if (typeof _defs !== 'undefined' && _defs) {
    return _defs.cloneNode(true);
  }
  return null;
}

/**
 * Parse GABC header safely
 * @param {string} gabcSource - GABC source string
 * @returns {Object|null}
 */
export function getHeaderSafe(gabcSource) {
  if (typeof getHeader === 'function') {
    return getHeader(gabcSource);
  }
  return null;
}

/**
 * Render chant to SVG safely
 * @param {Array} headerAndText - [header, text] array
 * @param {SVGElement} svg - Target SVG element
 * @param {SVGGElement} result - Result group element
 * @param {number[]} top - Array to store top offset
 * @returns {boolean} Whether rendering succeeded
 */
export function getChantSafe(headerAndText, svg, result, top) {
  if (typeof getChant === 'function') {
    try {
      getChant(headerAndText, svg, result, top);
      return true;
    } catch (e) {
      console.error('getChant error:', e);
      return false;
    }
  }
  return false;
}

/**
 * Relayout chant to fit width safely
 * @param {SVGElement} svg - SVG element to relayout
 * @param {number} width - Target width
 * @returns {boolean} Whether relayout succeeded
 */
export function relayoutChantSafe(svg, width) {
  if (typeof relayoutChant === 'function') {
    try {
      relayoutChant(svg, width);
      return true;
    } catch (e) {
      console.error('relayoutChant error:', e);
      return false;
    }
  }
  return false;
}

/**
 * Set global svgWidth for jgabc
 * @param {number} width - Width value
 */
export function setSvgWidth(width) {
  if (typeof svgWidth !== 'undefined') {
    // eslint-disable-next-line no-global-assign
    svgWidth = width;
  }
}

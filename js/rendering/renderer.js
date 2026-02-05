/**
 * GABC Renderer Module
 * Handles rendering of GABC notation to SVG using the jgabc library
 */

import { isJgabcReady, getHeaderSafe, getDefsSafe, getStaffOffset, setSvgWidth, getChantSafe, relayoutChantSafe } from './jgabc-adapter.js';
import { RENDER, DELAYS } from '../core/constants.js';

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

// Normalize GABC: trim leading whitespace from each line (handles autoformat)
export function normalizeGabc(source) {
  return source
    .split("\n")
    .map(function (line) {
      return line.trimStart();
    })
    .join("\n")
    .trim();
}

// Extend staff lines to full width (override jgabc's trimStaff behavior)
export function extendStaffLines(svg, width) {
  // Set fill on staff path in defs (CSS doesn't cascade into defs properly)
  var staffDef = svg.querySelector("defs #staff path");
  if (staffDef) {
    // Use CSS variable so it responds to dark mode changes
    staffDef.style.setProperty("fill", "var(--svg-fill, #000000)", "important");
  }

  // Extend staff line widths
  svg.querySelectorAll("use").forEach(function (staffUse) {
    var href = staffUse.href && staffUse.href.baseVal;
    if (href === "#staff") {
      var transform = staffUse.getAttribute("transform") || "";
      if (transform.indexOf("scale(") !== -1) {
        // Replace existing scale
        transform = transform.replace(/scale\([^)]*\)/, "scale(" + width + ",1)");
      } else {
        // Add scale if none exists
        transform = transform + " scale(" + width + ",1)";
      }
      staffUse.setAttribute("transform", transform.trim());
    }
  });
}

// Render a single GABC container element
export function renderGabc(container) {
  var gabcSource = container.getAttribute("data-gabc");

  if (!gabcSource) {
    var gabcId = container.getAttribute("data-gabc-id");
    if (gabcId) {
      var scriptEl = document.getElementById(gabcId);
      if (scriptEl) {
        gabcSource = scriptEl.textContent;
      }
    }
  }
  if (!gabcSource) return;

  // Normalize whitespace from autoformatting
  gabcSource = normalizeGabc(gabcSource);

  var width = container.offsetWidth || RENDER.DEFAULT_WIDTH;

  // Create wrapper div for jgabc (it needs #chant-preview or [for] attribute)
  var wrapperId = "chant-preview-" + Math.random().toString(36).substr(2, 9);
  var wrapper = document.createElement("div");
  wrapper.setAttribute("id", wrapperId);
  wrapper.style.width = "100%";
  container.innerHTML = "";
  container.appendChild(wrapper);

  // Create SVG element
  var svgns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(svgns, "svg");
  svg.setAttribute("class", "Exsurge ChantScore");
  svg.setAttribute("width", width);
  svg.setAttribute("style", "width:100%");
  wrapper.appendChild(svg);

  try {
    // Parse GABC header and text
    var header = getHeaderSafe(gabcSource);
    var text = gabcSource;
    if (header && header.original) {
      text = gabcSource.slice(header.original.length);
    }

    // Create result group element
    var result = document.createElementNS(svgns, "g");
    result.setAttribute(
      "transform",
      "translate(0," + getStaffOffset() + ")"
    );
    result.setAttribute("class", "caeciliae");
    svg.appendChild(result);

    // Append defs if available
    var defs = getDefsSafe();
    if (defs) {
      svg.insertBefore(defs, result);
    }

    // Set global width for jgabc
    setSvgWidth(width);

    // Call jgabc's getChant function
    var top = [0];
    if (!getChantSafe([header, text], svg, result, top)) {
      console.warn('Chant rendering failed for container:', container.getAttribute('data-gabc-id') || '(inline)');
      return;
    }

    // Relayout to fit width (may fail if fonts not loaded yet)
    if (!relayoutChantSafe(svg, width)) {
      // Schedule a retry during idle time to avoid blocking user interaction
      const retryRelayout = () => {
        relayoutChantSafe(svg, width);
        extendStaffLines(svg, width);
      };

      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(retryRelayout, { timeout: DELAYS.IDLE_TIMEOUT });
      } else {
        setTimeout(retryRelayout, DELAYS.FONT_FALLBACK);
      }
    }

    // Always extend staff lines immediately (even if relayout failed)
    extendStaffLines(svg, width);

    // Force red color on verse numbers and asterisks (override jgabc inline styles)
    svg.querySelectorAll(".i, .v, tspan.i, tspan.v").forEach(function (el) {
      el.style.fill = "var(--accent-red, #d00)";
      el.style.fontStyle = "normal";
    });

    // Adjust height based on content
    try {
      var bbox = result.getBBox();
      var height = bbox.height + top[0] + 20;
      svg.setAttribute("height", height);
    } catch (e) {
      console.warn('Could not calculate SVG height, using fallback:', e);
      svg.setAttribute("height", RENDER.DEFAULT_HEIGHT);
    }

  } catch (e) {
    console.error("GABC render error:", e);
    showError(container, 'Error rendering GABC: ' + e.message);
  }
}

// Track current render operation for cancellation
let currentRenderAbort = null;

// Track active IntersectionObserver for cleanup
let activeObserver = null;

// Cancel any in-progress rendering
export function cancelRender() {
  if (currentRenderAbort) {
    currentRenderAbort.cancelled = true;
    currentRenderAbort = null;
  }
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }
}

// Render all GABC elements using lazy loading (IntersectionObserver)
export async function renderAllGabc(container = document) {
  // Cancel any previous render
  cancelRender();

  const abortToken = { cancelled: false };
  currentRenderAbort = abortToken;

  const elements = container.querySelectorAll("[data-gabc], [data-gabc-id]");

  if (elements.length === 0) {
    currentRenderAbort = null;
    return;
  }

  // Set to track which elements have been rendered
  const rendered = new WeakSet();

  // Render a single element
  const renderElement = (element) => {
    if (rendered.has(element) || abortToken.cancelled) return;
    rendered.add(element);
    renderGabc(element);
    element.classList.remove('loading');
  };

  // Create IntersectionObserver for lazy loading
  const observer = new IntersectionObserver((entries) => {
    if (abortToken.cancelled) return;

    for (const entry of entries) {
      if (entry.isIntersecting) {
        renderElement(entry.target);
        observer.unobserve(entry.target);
      }
    }
  }, {
    rootMargin: '200px 0px', // Start rendering 200px before element enters viewport
    threshold: 0
  });

  activeObserver = observer;

  // Wait for layout to be computed before checking positions
  // Double rAF ensures we wait for both the next frame and subsequent layout
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

  // Check for cancellation after waiting
  if (abortToken.cancelled) return;

  // Observe all elements and immediately render visible ones
  const INITIAL_BATCH = 8; // Render first N immediately for fast initial paint
  let initialCount = 0;

  for (const element of elements) {
    if (abortToken.cancelled) break;

    // Check if element is in or near viewport
    const rect = element.getBoundingClientRect();
    const isNearViewport = rect.top < window.innerHeight + 200;

    if (isNearViewport && initialCount < INITIAL_BATCH) {
      // Render immediately if in initial viewport
      renderElement(element);
      initialCount++;
      // Yield occasionally for responsiveness
      if (initialCount % 4 === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    } else {
      // Lazy load via observer
      observer.observe(element);
    }
  }
}

// Maximum polling attempts before giving up on jgabc load
const MAX_JGABC_ATTEMPTS = 100;

// Wait for jQuery and jgabc to be ready, then render
export function waitForJgabc(callback) {
  const execute = () => {
    if (callback) callback();
    else renderAllGabc();
  };

  if (isJgabcReady()) {
    execute();
    return;
  }

  // Try once more after a frame, then fall back to polling
  requestAnimationFrame(() => {
    if (isJgabcReady()) {
      execute();
      return;
    }

    // Fall back to polling if still not ready
    let attempts = 0;
    const poll = () => {
      if (isJgabcReady()) {
        execute();
      } else if (++attempts >= MAX_JGABC_ATTEMPTS) {
        console.error('jgabc library failed to load after ' + (MAX_JGABC_ATTEMPTS * DELAYS.JGABC_RETRY / 1000) + 's');
        // Remove loading skeletons and show error so page doesn't appear stuck
        document.querySelectorAll('[data-gabc].loading, [data-gabc-id].loading').forEach(el => {
          el.classList.remove('loading');
          showError(el, 'Chant rendering library failed to load. Please reload the page.');
        });
      } else {
        setTimeout(poll, DELAYS.JGABC_RETRY);
      }
    };
    poll();
  });
}

// Extend staff lines on all existing rendered chants
export function extendAllStaffLines() {
  document
    .querySelectorAll("[data-gabc] svg, [data-gabc-id] svg")
    .forEach(function (svg) {
      var parent = svg.parentNode && svg.parentNode.parentNode;
      var width = (parent && parent.offsetWidth) || RENDER.DEFAULT_WIDTH;
      extendStaffLines(svg, width);
    });
}

// Initialize rendering with font loading
export function initRenderer() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      // Just extend staff lines on existing chants, don't re-render
      setTimeout(extendAllStaffLines, DELAYS.FONT_LOAD);
    });
  } else {
    setTimeout(extendAllStaffLines, DELAYS.FONT_FALLBACK);
  }
}

// Handle window resize - relayout all chants to fit new width (debounced)
let resizeTimeout;
export function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    if (isJgabcReady()) {
      document
        .querySelectorAll("[data-gabc] svg, [data-gabc-id] svg")
        .forEach(function (svg) {
          var parent = svg.parentNode && svg.parentNode.parentNode;
          var width = (parent && parent.offsetWidth) || RENDER.DEFAULT_WIDTH;
          relayoutChantSafe(svg, width);
          extendStaffLines(svg, width);
        });
    }
  }, DELAYS.RESIZE_DEBOUNCE);
}

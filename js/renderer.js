/**
 * GABC Renderer Module
 * Handles rendering of GABC notation to SVG using the jgabc library
 */

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
  svg.querySelectorAll("use").forEach(function (staffUse) {
    var href = staffUse.href && staffUse.href.baseVal;
    if (href === "#staff") {
      var transform = staffUse.getAttribute("transform") || "";
      staffUse.setAttribute(
        "transform",
        transform.replace(/scale\([^)]*\)/, "scale(" + width + ",1)")
      );
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

  var width = container.offsetWidth || 800;

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
    // Parse GABC header and text using jgabc's getHeader function
    var header =
      typeof getHeader === "function" ? getHeader(gabcSource) : null;
    var text = gabcSource;
    if (header && header.original) {
      text = gabcSource.slice(header.original.length);
    }

    // Create result group element
    var result = document.createElementNS(svgns, "g");
    result.setAttribute(
      "transform",
      "translate(0," +
        (typeof staffoffset !== "undefined" ? staffoffset : 36) +
        ")"
    );
    result.setAttribute("class", "caeciliae");
    svg.appendChild(result);

    // Append defs if available
    if (typeof _defs !== "undefined" && _defs) {
      svg.insertBefore(_defs.cloneNode(true), result);
    }

    // Set global width for jgabc
    if (typeof svgWidth !== "undefined") {
      svgWidth = width;
    }

    // Call jgabc's getChant function
    var top = [0];
    if (typeof getChant === "function") {
      getChant([header, text], svg, result, top);
    }

    // Relayout to fit width (may fail if fonts not loaded yet)
    try {
      if (typeof relayoutChant === "function") {
        relayoutChant(svg, width);
      }
      extendStaffLines(svg, width);
    } catch (relayoutError) {
      // Schedule a retry during idle time to avoid blocking user interaction
      const retryRelayout = () => {
        try {
          if (typeof relayoutChant === "function") {
            relayoutChant(svg, width);
          }
          extendStaffLines(svg, width);
        } catch (e) {
          // Silently ignore retry failure
        }
      };

      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(retryRelayout, { timeout: 2000 });
      } else {
        setTimeout(retryRelayout, 500);
      }
    }

    // Force red color on verse numbers and asterisks (override jgabc inline styles)
    svg.querySelectorAll(".i, .v, tspan.i, tspan.v").forEach(function (el) {
      el.style.fill = "#d00";
      el.style.fontStyle = "normal";
    });

    // Adjust height based on content
    try {
      var bbox = result.getBBox();
      var height = bbox.height + top[0] + 20;
      svg.setAttribute("height", height);
    } catch (e) {
      svg.setAttribute("height", 100);
    }
  } catch (e) {
    console.error("GABC render error:", e);
    container.innerHTML =
      "<p style='color:red'>Error rendering GABC: " + e.message + "</p>";
  }
}

// Track current render operation for cancellation
let currentRenderAbort = null;

// Cancel any in-progress rendering
export function cancelRender() {
  if (currentRenderAbort) {
    currentRenderAbort.cancelled = true;
    currentRenderAbort = null;
  }
}

// Render all GABC elements on the page (async, yields between chants)
export async function renderAllGabc(container = document) {
  // Cancel any previous render
  cancelRender();

  const abortToken = { cancelled: false };
  currentRenderAbort = abortToken;

  const elements = container.querySelectorAll("[data-gabc], [data-gabc-id]");

  for (const element of elements) {
    // Check if cancelled before each render
    if (abortToken.cancelled) {
      return;
    }

    renderGabc(element);
    // Yield to browser after each chant to keep UI responsive
    await new Promise(resolve => setTimeout(resolve, 0));
  }

  currentRenderAbort = null;
}

// Synchronous version for backwards compatibility
export function renderAllGabcSync() {
  document
    .querySelectorAll("[data-gabc], [data-gabc-id]")
    .forEach(renderGabc);
}

// Wait for jQuery and jgabc to be ready, then render
export function waitForJgabc(callback) {
  if (
    typeof $ !== "undefined" &&
    typeof getChant === "function" &&
    typeof _defs !== "undefined"
  ) {
    // jgabc is ready
    if (callback) callback();
    else renderAllGabc();
  } else {
    // Wait and retry
    setTimeout(function() { waitForJgabc(callback); }, 100);
  }
}

// Initialize rendering with font loading
export function initRenderer() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setTimeout(function() { waitForJgabc(); }, 200);
    });
  } else {
    setTimeout(function() { waitForJgabc(); }, 500);
  }
}

// Handle window resize - re-render all chants (debounced)
let resizeTimeout;
export function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function () {
    if (typeof $ !== "undefined" && typeof relayoutChant === "function") {
      document
        .querySelectorAll("[data-gabc] svg, [data-gabc-id] svg")
        .forEach(function (svg) {
          try {
            var width = svg.parentNode.parentNode.offsetWidth || 800;
            relayoutChant(svg, width);
            extendStaffLines(svg, width);
          } catch (e) {}
        });
    }
  }, 250);
}

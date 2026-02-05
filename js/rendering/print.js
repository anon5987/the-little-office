/**
 * Print Module
 * Handles print preparation - SVG splitting for page breaks
 */

import { extendStaffLines } from './renderer.js';

// Print configuration
const printWidth = 900; // wider = fewer line breaks = shorter SVGs
const pageWidth = 720;  // approximate print page width in pixels

// Store for afterprint restoration
let printSplitData = [];

// Get Y positions of each system (staff line) in the SVG
function getSystemYPositions(svg) {
  var positions = [];

  // Find staff groups - first try inside caeciliae, then in entire SVG
  var caeciliaeGroup = svg.querySelector('g.caeciliae');
  var staffGroups = caeciliaeGroup
    ? Array.from(caeciliaeGroup.querySelectorAll('g[id^="staff"]'))
    : [];

  // If no staff groups in caeciliae, look for system groups in entire SVG
  if (staffGroups.length <= 1) {
    var systemGroups = Array.from(svg.querySelectorAll('g[id^="system"]'));
    if (systemGroups.length > 1) {
      // Extract Y positions directly from system group transforms
      systemGroups.forEach(function(sys) {
        var transform = sys.getAttribute('transform') || '';
        var match = transform.match(/translate\(([^,)]+),\s*([^)]+)\)/);
        if (match) {
          var y = parseFloat(match[2]) || 0;
          positions.push(y);
        }
      });

      // Sort and dedupe
      positions.sort(function(a, b) { return a - b; });
      positions = positions.filter(function(y, i, arr) {
        return i === 0 || y - arr[i-1] > 10;
      });

      return positions;
    }
  }

  // If we found staff groups in caeciliae, extract Y positions from parent (system) transforms
  staffGroups.forEach(function(staff) {
    // The transform is on the parent element (system group), not the staff group itself
    var parent = staff.parentElement;
    var transform = parent ? parent.getAttribute('transform') || '' : '';
    var match = transform.match(/translate\(([^,)]+),\s*([^)]+)\)/);
    if (match) {
      var y = parseFloat(match[2]) || 0;
      positions.push(y);
    }
  });

  // Sort by Y position and remove duplicates
  positions.sort(function(a, b) { return a - b; });
  positions = positions.filter(function(y, i, arr) {
    return i === 0 || y - arr[i-1] > 10; // Remove positions within 10px of each other
  });

  return positions;
}

// Split a multi-line chant SVG into separate line containers
function splitChantForPrint(svg, targetWidth) {
  var positions = getSystemYPositions(svg);
  if (positions.length <= 1) return null;

  var svgWidth = targetWidth || printWidth;
  var svgHeight = parseFloat(svg.getAttribute('height')) || 800;

  // Get the staffoffset (caeciliae group Y offset) to adjust coordinates
  var staffOff = (typeof staffoffset !== 'undefined') ? staffoffset : 44;

  // Create container for line divs (built in memory, inserted once at end)
  var container = document.createElement('div');
  container.className = 'chant-print-lines';

  var lineSvgs = [];
  var numPositions = positions.length;
  var normalLineHeight = numPositions > 1 ? positions[1] - positions[0] : 83;

  for (var index = 0; index < numPositions; index++) {
    var yPos = positions[index];
    var lineStart, lineHeight;

    if (index === 0) {
      lineStart = 0;
      lineHeight = staffOff + positions[1];
    } else if (index === numPositions - 1) {
      // Last line: ensure enough height for text below staff
      lineStart = staffOff + yPos;
      lineHeight = Math.max(svgHeight - lineStart + 50, normalLineHeight + 40);
    } else {
      lineStart = staffOff + yPos;
      lineHeight = positions[index + 1] - yPos;
    }

    // Create wrapper with fixed height for clipping
    var lineWrapper = document.createElement('div');
    lineWrapper.className = 'chant-line';
    lineWrapper.style.cssText = 'height:' + lineHeight + 'px;overflow:hidden;padding-right:10px';

    // Clone SVG and use negative margin to show correct portion
    var lineSvg = svg.cloneNode(true);
    lineSvg.className = 'Exsurge ChantScore chant-line-svg';
    lineSvg.setAttribute('width', svgWidth);
    lineSvg.setAttribute('height', svgHeight);
    lineSvg.removeAttribute('viewBox');
    lineSvg.style.cssText = 'display:block;margin-top:' + (-lineStart) + 'px';

    lineWrapper.appendChild(lineSvg);
    container.appendChild(lineWrapper);
    lineSvgs.push(lineSvg);
  }

  // Insert container, hide original
  svg.parentNode.insertBefore(container, svg);
  svg.style.display = 'none';

  return {
    container: container,
    originalSvg: svg,
    systems: lineSvgs
  };
}

// Restore a split chant to its original state
function restoreChantFromPrint(splitData) {
  if (!splitData) return;
  splitData.originalSvg.style.display = '';
  if (splitData.container && splitData.container.parentNode) {
    splitData.container.parentNode.removeChild(splitData.container);
  }
}

// Handle beforeprint event
function handleBeforePrint() {
  printSplitData = [];

  if (typeof relayoutChant !== "function") return;

  var scale = pageWidth / printWidth;
  var svgs = document.querySelectorAll(".chant svg");

  // First pass: relayout all chants (batched reads/writes)
  svgs.forEach(function (svg) {
    // Save current screen state
    svg.dataset.screenWidth = svg.getAttribute("width");
    svg.dataset.screenHeight = svg.getAttribute("height");
    svg.dataset.screenStyle = svg.getAttribute("style") || "";
    svg.dataset.screenViewBox = svg.getAttribute("viewBox") || "";

    // Relayout for print width
    try {
      relayoutChant(svg, printWidth);
      extendStaffLines(svg, printWidth);
    } catch (e) {
      console.error("Print layout error:", e);
    }
  });

  // Second pass: split and scale (batched)
  svgs.forEach(function (svg) {
    try {
      var splitData = splitChantForPrint(svg, printWidth);
      if (splitData) {
        printSplitData.push(splitData);

        // Apply scaling to all line SVGs
        var systems = splitData.systems;
        for (var i = 0; i < systems.length; i++) {
          var lineSvg = systems[i];
          var wrapper = lineSvg.parentElement;
          if (wrapper) {
            var wrapperHeight = parseFloat(wrapper.style.height) || 83;
            var marginTop = parseFloat(lineSvg.style.marginTop) || 0;
            var svgW = parseFloat(lineSvg.getAttribute('width')) || printWidth;
            var svgH = parseFloat(lineSvg.getAttribute('height')) || 600;

            lineSvg.setAttribute('viewBox', '0 0 ' + svgW + ' ' + svgH);
            lineSvg.setAttribute('width', svgW * scale);
            lineSvg.setAttribute('height', svgH * scale);
            lineSvg.style.marginTop = (marginTop * scale) + 'px';
            wrapper.style.height = (wrapperHeight * scale) + 'px';
          }
        }
      } else {
        // Single-line chant - use existing scaling
        var svgHeight = parseFloat(svg.getAttribute("height")) || 100;
        svg.setAttribute("viewBox", "0 0 " + printWidth + " " + svgHeight);
        svg.setAttribute("width", pageWidth);
        svg.setAttribute("height", svgHeight * scale);
        svg.style.width = pageWidth + "px";
        svg.style.height = (svgHeight * scale) + "px";
      }
    } catch (e) {
      console.error("Print layout error:", e);
    }
  });
}

// Handle afterprint event
function handleAfterPrint() {
  // Restore all split chants first
  printSplitData.forEach(restoreChantFromPrint);
  printSplitData = [];

  // Then restore original screen layout
  if (typeof relayoutChant === "function") {
    document.querySelectorAll(".chant svg").forEach(function (svg) {
      try {
        var screenWidth = parseFloat(svg.dataset.screenWidth) || svg.parentNode.offsetWidth || 800;
        relayoutChant(svg, screenWidth);
        extendStaffLines(svg, screenWidth);

        // Restore viewBox
        if (svg.dataset.screenViewBox) {
          svg.setAttribute("viewBox", svg.dataset.screenViewBox);
        } else {
          svg.removeAttribute("viewBox");
        }

        svg.setAttribute("width", screenWidth);
        if (svg.dataset.screenHeight) {
          svg.setAttribute("height", svg.dataset.screenHeight);
        }

        // Restore original style
        if (svg.dataset.screenStyle) {
          svg.setAttribute("style", svg.dataset.screenStyle);
        } else {
          svg.style.width = "100%";
          svg.style.height = "";
        }

        delete svg.dataset.screenWidth;
        delete svg.dataset.screenHeight;
        delete svg.dataset.screenStyle;
        delete svg.dataset.screenViewBox;
      } catch (e) {}
    });
  }
}

// Initialize print handlers
export function initPrint() {
  window.addEventListener("beforeprint", handleBeforePrint);
  window.addEventListener("afterprint", handleAfterPrint);
}

// Export for potential direct use
export { printWidth, pageWidth, handleBeforePrint, handleAfterPrint };

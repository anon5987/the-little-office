document.addEventListener("DOMContentLoaded", function () {
  // Fix whitespace issues in static SVG text elements
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

  // ============================================
  // DYNAMIC GABC RENDERING WITH JGABC.JS
  // ============================================

  var resizeTimeout;

  // Normalize GABC: trim leading whitespace from each line (handles autoformat)
  function normalizeGabc(source) {
    return source
      .split("\n")
      .map(function (line) {
        return line.trimStart();
      })
      .join("\n")
      .trim();
  }

  // Extend staff lines to full width (override jgabc's trimStaff behavior)
  function extendStaffLines(svg, width) {
    svg.querySelectorAll("use").forEach(function (staffUse) {
      var href = staffUse.href && staffUse.href.baseVal;
      if (href === "#staff") {
        var transform = staffUse.getAttribute("transform") || "";
        staffUse.setAttribute(
          "transform",
          transform.replace(/scale\([^)]*\)/, "scale(" + width + ",1)"),
        );
      }
    });
  }

  function renderGabc(container) {
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
          ")",
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

      // Relayout to fit width
      if (typeof relayoutChant === "function") {
        relayoutChant(svg, width);
      }

      extendStaffLines(svg, width);

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

  function renderAllGabc() {
    document
      .querySelectorAll("[data-gabc], [data-gabc-id]")
      .forEach(renderGabc);
  }

  // Wait for jQuery and jgabc to be ready
  function waitForJgabc() {
    if (
      typeof $ !== "undefined" &&
      typeof getChant === "function" &&
      typeof _defs !== "undefined"
    ) {
      // jgabc is ready, render all GABC elements
      renderAllGabc();
    } else {
      // Wait and retry
      setTimeout(waitForJgabc, 100);
    }
  }

  // Wait for fonts to load before rendering
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      setTimeout(waitForJgabc, 200);
    });
  } else {
    setTimeout(waitForJgabc, 500);
  }

  // Handle print - re-render at wider width, then scale to fit page
  var printWidth = 900; // wider = fewer line breaks = shorter SVGs
  var pageWidth = 720; // approximate print page width in pixels

  // ============================================
  // PRINT PAGE BREAKING - SVG SPLITTING
  // ============================================

  var printSplitData = [];  // Store for afterprint restoration

  // Simpler approach: use viewBox to show slices of the original SVG
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

  function restoreChantFromPrint(splitData) {
    if (!splitData) return;
    splitData.originalSvg.style.display = '';
    if (splitData.container && splitData.container.parentNode) {
      splitData.container.parentNode.removeChild(splitData.container);
    }
  }

  window.addEventListener("beforeprint", function () {
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
  });

  window.addEventListener("afterprint", function () {
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
  });

  // Re-render on window resize (debounced)
  window.addEventListener("resize", function () {
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
  });

  // ============================================
  // TRANSLATION CONTROLS
  // ============================================

  function updateUITranslations(lang) {
    if (typeof translations === "undefined") return;
    // Update all elements with data-translation-key that are NOT .translation (chant translations)
    document.querySelectorAll("[data-translation-key]:not(.translation)").forEach(function (el) {
      var key = el.dataset.translationKey;
      var translation = translations[key];
      if (translation && translation[lang]) {
        el.textContent = translation[lang];
      }
    });
  }

  function updateChantTranslations(lang) {
    if (typeof translations === "undefined") return;
    document.querySelectorAll(".translation").forEach(function (el) {
      var key = el.dataset.translationKey;
      // For antiphons, -pre and -post share the same translation
      var baseKey = key.replace(/-(pre|post)$/, "");
      var translation = translations[key] || translations[baseKey];
      if (translation && translation[lang]) {
        el.textContent = translation[lang];
      }
    });
  }

  function initTranslations() {
    var checkbox = document.getElementById("show-translations");
    var langSelect = document.getElementById("language-selector");

    if (!langSelect) return;

    // Checkbox toggles chant translation visibility
    if (checkbox) {
      checkbox.addEventListener("change", function () {
        document.body.classList.toggle("show-translations", checkbox.checked);
      });
    }

    // Language selector updates both UI and chant translations
    langSelect.addEventListener("change", function () {
      updateUITranslations(langSelect.value);
      updateChantTranslations(langSelect.value);
    });

    // Initialize all translations with default language
    updateUITranslations(langSelect.value);
    updateChantTranslations(langSelect.value);
  }

  initTranslations();
});

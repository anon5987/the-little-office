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

  function collectSystemReferencedIds(system) {
    var ids = new Set();
    system.querySelectorAll('use').forEach(function(use) {
      var href = use.href && use.href.baseVal;
      if (href && href.startsWith('#')) {
        ids.add(href.substring(1));
      }
    });
    return ids;
  }

  function createLineSvg(system, originalDefs, lineIndex, svgWidth, caeciliaeGroup) {
    var svgns = 'http://www.w3.org/2000/svg';

    // Get the Y offset for this system from its staff group transform
    var systemY = 0;
    var staffGroup = system.querySelector('[id^="staff"]');
    if (staffGroup) {
      var transform = staffGroup.getAttribute('transform') || '';
      var match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (match) {
        systemY = parseFloat(match[2]) || 0;
      }
    }

    // Find text elements that belong to this system (they're siblings with class="systemN")
    var systemTexts = caeciliaeGroup.querySelectorAll('text.system' + lineIndex);

    // Calculate bounding box including text
    var bbox = system.getBBox();
    var textBbox = { y: bbox.y, height: bbox.height };
    systemTexts.forEach(function(text) {
      try {
        var tb = text.getBBox();
        var textTransform = text.getAttribute('transform') || '';
        var textMatch = textTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        var textY = textMatch ? parseFloat(textMatch[2]) || 0 : 0;
        var adjustedY = textY - systemY;
        var bottom = adjustedY + tb.height;
        if (bottom > textBbox.height) textBbox.height = bottom + 10;
      } catch(e) {}
    });

    var width = Math.max(bbox.width + bbox.x + 20, svgWidth);
    var height = Math.max(bbox.height + 40, textBbox.height + 50);

    // Create new SVG
    var newSvg = document.createElementNS(svgns, 'svg');
    newSvg.setAttribute('class', 'Exsurge ChantScore chant-line-svg');
    newSvg.setAttribute('width', width);
    newSvg.setAttribute('height', height);

    // Clone defs (only symbols used by this system + staff + masks)
    var newDefs = document.createElementNS(svgns, 'defs');
    var referencedIds = collectSystemReferencedIds(system);
    referencedIds.add('staff');

    Array.from(originalDefs.children).forEach(function(defChild) {
      var id = defChild.getAttribute('id');
      if (!id) return;

      // Include referenced symbols, staff, ledger lines
      if (referencedIds.has(id) || id.startsWith('ledger')) {
        newDefs.appendChild(defChild.cloneNode(true));
      }
      // Include mask for this system (adjust transform)
      if (id === 'staffmask' + lineIndex) {
        var clonedMask = defChild.cloneNode(true);
        clonedMask.setAttribute('transform', 'translate(0,0)');
        newDefs.appendChild(clonedMask);
      }
    });
    newSvg.appendChild(newDefs);

    // Create caeciliae group with adjusted transform
    var newCaeciliae = document.createElementNS(svgns, 'g');
    newCaeciliae.setAttribute('class', 'caeciliae');
    var staffOff = (typeof staffoffset !== 'undefined') ? staffoffset : 44;
    newCaeciliae.setAttribute('transform', 'translate(0,' + staffOff + ')');

    // Clone system and adjust coordinates to origin
    var clonedSystem = system.cloneNode(true);
    clonedSystem.setAttribute('id', 'system0');

    // Adjust staff group transform (remove systemY offset)
    var clonedStaffGroup = clonedSystem.querySelector('[id^="staff"]');
    if (clonedStaffGroup) {
      var transform = clonedStaffGroup.getAttribute('transform') || '';
      var match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (match) {
        var x = parseFloat(match[1]) || 0;
        var y = parseFloat(match[2]) || 0;
        clonedStaffGroup.setAttribute('transform', 'translate(' + x + ',' + (y - systemY) + ')');
      }
      clonedStaffGroup.setAttribute('id', 'staff0');
      clonedStaffGroup.setAttribute('mask', 'url(#staffmask' + lineIndex + ')');
    }

    newCaeciliae.appendChild(clonedSystem);

    // Clone and adjust text elements for this system
    systemTexts.forEach(function(text) {
      var clonedText = text.cloneNode(true);
      var transform = clonedText.getAttribute('transform') || '';
      var match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
      if (match) {
        var x = parseFloat(match[1]) || 0;
        var y = parseFloat(match[2]) || 0;
        clonedText.setAttribute('transform', 'translate(' + x + ',' + (y - systemY) + ')');
      }
      newCaeciliae.appendChild(clonedText);
    });

    newSvg.appendChild(newCaeciliae);

    return newSvg;
  }

  function splitChantForPrint(svg) {
    var caeciliaeGroup = svg.querySelector('g.caeciliae');
    if (!caeciliaeGroup) return null;

    var systems = Array.from(caeciliaeGroup.querySelectorAll('[id^="system"]'));
    if (systems.length <= 1) return null;  // No split needed

    var originalDefs = svg.querySelector('defs');
    var svgWidth = parseFloat(svg.getAttribute('width')) || 900;

    // Create container for line SVGs
    var container = document.createElement('div');
    container.className = 'chant-print-lines';

    var lineSvgs = [];
    systems.forEach(function(system, index) {
      var lineSvg = createLineSvg(system, originalDefs, index, svgWidth, caeciliaeGroup);
      var lineWrapper = document.createElement('div');
      lineWrapper.className = 'chant-line';
      lineWrapper.appendChild(lineSvg);
      container.appendChild(lineWrapper);
      lineSvgs.push(lineSvg);
    });

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

    if (typeof relayoutChant === "function") {
      document.querySelectorAll(".chant svg").forEach(function (svg) {
        try {
          // Save current screen state
          svg.dataset.screenWidth = svg.getAttribute("width");
          svg.dataset.screenHeight = svg.getAttribute("height");
          svg.dataset.screenStyle = svg.getAttribute("style") || "";
          svg.dataset.screenViewBox = svg.getAttribute("viewBox") || "";

          // Relayout for print width
          relayoutChant(svg, printWidth);
          extendStaffLines(svg, printWidth);

          return;

          // Split into per-line SVGs for page breaking
          var splitData = splitChantForPrint(svg);
          if (splitData) {
            printSplitData.push(splitData);

            // Scale each line SVG for print
            splitData.systems.forEach(function(lineSvg) {
              var lineWidth = parseFloat(lineSvg.getAttribute('width')) || printWidth;
              var lineHeight = parseFloat(lineSvg.getAttribute('height')) || 100;
              var scale = pageWidth / printWidth;

              lineSvg.setAttribute('viewBox', '0 0 ' + lineWidth + ' ' + lineHeight);
              lineSvg.setAttribute('width', lineWidth * scale);
              lineSvg.setAttribute('height', lineHeight * scale);
            });
          } else {
            // Single-line chant - use existing scaling
            var svgHeight = parseFloat(svg.getAttribute("height")) || 100;
            svg.setAttribute("viewBox", "0 0 " + printWidth + " " + svgHeight);
            var scale = pageWidth / printWidth;
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

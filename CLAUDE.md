# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vespers is a static web application for displaying Gregorian chant liturgical services (Roman Catholic Vespers). It renders GABC (Gregorian Abbey Chant) notation to SVG using the jgabc library.

## Development

This is a static HTML/CSS/JavaScript project with no build system. Files are served directly by browsers.

To develop, open `vespers.html` in a browser or serve the directory with any static file server.

## Architecture

### File Structure
- `vespers.html` - Main document containing liturgical content and GABC notation in `<script type="text/gabc">` blocks
- `vespers.js` - Client-side logic for GABC rendering, responsive layout, and print handling
- `vespers.css` - Application styles with responsive design and print optimization
- `jgabc.full.js` - Third-party library for converting GABC notation to SVG (from github.com/bbloomf/jgabc)

### GABC Rendering Pipeline

1. GABC notation is embedded in HTML as `<script type="text/gabc" id="...">` elements
2. Render targets are `<div class="chant" data-gabc-id="...">` elements referencing the script IDs
3. On page load, `vespers.js` waits for jQuery and jgabc to initialize
4. Each GABC element is parsed via `getHeader()` and rendered via `getChant()` from jgabc
5. `relayoutChant()` adjusts SVG width responsively

### Key Functions in vespers.js
- `renderGabc(container)` - Core rendering function that processes a single GABC element
- `normalizeGabc(source)` - Strips leading whitespace from GABC lines
- `renderAllGabc()` - Batch renders all elements with `data-gabc` or `data-gabc-id` attributes
- `waitForJgabc()` - Polls for jgabc library initialization before rendering

### GABC Format
GABC notation uses parenthesized notes after syllables: `(c4)Do(h)mi(h)ne,(h)` where:
- `(c4)` sets the clef
- Letters in parentheses are neume notes (e.g., `h`, `j`, `k`)
- Text outside parentheses is the sung text

Header metadata includes: `initial-style`, `annotation`, `user-notes`, `centering-scheme`

### Print Handling
The app handles print media specially - it re-renders chants at 900px width then scales down to fit the page, restoring screen layout after printing.

## Dependencies

External (CDN):
- jQuery 3.6.0
- Crimson Text font (jsDelivr)
- Caeciliae font (GitHub)

Bundled:
- jgabc.full.js - Gregorian chant notation renderer

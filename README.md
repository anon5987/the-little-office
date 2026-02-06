# The Little Office of the Blessed Virgin Mary

A static web application for The Little Office of the Blessed Virgin Mary, with Gregorian chant notation and multilingual translations.

## Features

- **Gregorian Chant Rendering** - SVG-rendered chant notation using GABC format
- **Multiple Hours** - Vespers, Lauds, and other canonical hours
- **Multilingual Support** - English and Czech translations
- **Liturgical Seasons** - Automatic hour selection based on the liturgical calendar and current time
- **Dark Mode**

## Live Demo

Visit the live application: [The Little Office](https://anon5987.github.io/the-little-office/)

## Usage

Open the application in a web browser and:

1. Select the hour you wish to pray from the landing page
2. Use the menu to toggle translations or switch languages
3. Follow along with the chant notation

## Development

This is a static HTML/CSS/JavaScript application with no build step required.

### Local Development

To run locally with proper font loading:

```bash
cd the-little-office
npx serve
```

Or with Python:

```bash
cd the-little-office
python -m http.server 8000
```

Then open the local URL shown in your terminal.

### Project Structure

```
the-little-office/
├── index.html              # Main HTML shell
├── app.css                 # Application styles and theming
├── little-office.css       # Chant-specific styles
├── js/                     # JavaScript modules
│   ├── app.js              # Main entry point
│   ├── core/               # Core application logic
│   │   ├── router.js       # Hash-based navigation
│   │   ├── state.js        # Application state management
│   │   ├── constants.js    # Configuration values
│   │   ├── types.js        # JSDoc type definitions
│   │   └── date-provider.js# Date functionality for liturgical calculations
│   ├── pages/              # Page components
│   │   ├── landing-page.js # Hour selection grid
│   │   └── hour-page.js    # Individual hour rendering
│   ├── rendering/          # GABC rendering
│   │   ├── hour-renderer.js# Dynamic hour content generation
│   │   ├── renderer.js     # GABC to SVG rendering
│   │   ├── jgabc-adapter.js# jgabc library wrapper
│   │   └── print.js        # Print preparation
│   ├── ui/                 # UI components
│   │   ├── sticky-header.js# Header controls and menu
│   │   ├── translation-manager.js
│   │   └── scroll-position.js
│   ├── utils/              # Utility modules
│   │   ├── selectors.js    # DOM element IDs
│   │   ├── event-manager.js# Scoped event cleanup
│   │   ├── svg-utils.js    # SVG manipulation utilities
│   │   ├── device-detection.js # iOS detection for rendering fixes
│   │   └── translation-helpers.js # Shared translation utilities
│   └── liturgical/         # Liturgical calculations
│       ├── season.js       # Office selection (1, 2, or 3)
│       ├── marian-season.js# Marian antiphon selection
│       └── hour-time.js    # Hour recommendations
├── data/                   # Content modules
│   ├── hours/              # Hour definitions (vespers.js, lauds.js, prime.js, terce.js, sext.js, none.js, compline.js)
│   ├── gabc/               # GABC chant notation
│   │   ├── common/         # Shared chants (opening, closing, marian-antiphons)
│   │   └── office1/        # Office-specific (antiphons, psalms, hymns, chapters, versicles)
│   └── translations/       # Language files (common.js, office1.js, psalms.js)
└── jgabc.full.js           # Chant rendering library
```

## Dependencies

- [jQuery 3.6.0](https://jquery.com/) - DOM manipulation
- [jgabc](https://github.com/bbloomf/jgabc) - GABC to SVG rendering
- [Crimson Text](https://fonts.google.com/specimen/Crimson+Text) - Body font
- [Caeciliae](https://github.com/bbloomf/caecilaea) - Gregorian chant font

## About GABC

GABC (Gregorio ABC) is a text notation format for Gregorian chant developed by the [Gregorio Project](http://gregorio-project.github.io/). It allows chant to be written in a human-readable format and rendered as traditional square notation.

## License

This project is provided for personal and liturgical use.

## Acknowledgments

- The Gregorio Project for GABC notation and tools
- Benjamin Bloomfield for the jgabc rendering library
- Based on [The Little Office of the Virgin Mary, Baronius Press, 2007](https://www.baronius.com/little-office-of-the-blessed-virgin-mary.html)

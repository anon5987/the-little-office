/**
 * Type Definitions for Hour Structure
 *
 * These JSDoc typedefs serve as contracts/interfaces for the hour data structure.
 * They provide IDE autocompletion and serve as documentation.
 *
 * @module types
 */

/**
 * Localized string with translations for each supported language
 * @typedef {Object} LocalizedString
 * @property {string} [en] - English translation
 * @property {string} [cs] - Czech translation
 * @property {string} [la] - Latin (usually for titles/names)
 */

/**
 * Base section type - all sections extend this
 * @typedef {Object} BaseSection
 * @property {string} type - Section type identifier
 */

/**
 * Opening section (Deus in adjutorium)
 * @typedef {Object} OpeningSection
 * @property {'opening'} type
 * @property {string} gabcId - ID of the GABC content
 * @property {string} translationKey - Key for translation lookup
 */

/**
 * Psalm with antiphon section
 * @typedef {Object} PsalmWithAntiphonSection
 * @property {'psalm-with-antiphon'} type
 * @property {string} psalmId - ID of the psalm GABC (e.g., 'psalm-109')
 * @property {string} psalmLabelKey - Translation key for psalm label (e.g., 'ui-psalm-109')
 * @property {string} psalmIncipit - Latin incipit of the psalm (e.g., 'Dixit dominus')
 * @property {string} antiphonKey - ID of the antiphon GABC (use incipit, e.g., 'dum-esset-rex')
 */

/**
 * Chapter/Little Chapter section
 * @typedef {Object} ChapterSection
 * @property {'chapter'} type
 * @property {string} gabcId - ID of the GABC content
 * @property {string} labelKey - Translation key for section label
 * @property {string} reference - Scripture reference (e.g., 'Ecclus. xxiv. 14')
 * @property {string} translationKey - Key for translation lookup
 */

/**
 * Hymn section
 * @typedef {Object} HymnSection
 * @property {'hymn'} type
 * @property {string} gabcId - ID of the GABC content (use incipit, e.g., 'ave-maris-stella')
 * @property {string} labelKey - Translation key for section label
 * @property {string} translationKey - Key for translation lookup
 */

/**
 * Versicle variant
 * @typedef {Object} VersicleVariant
 * @property {string} gabcId - ID of the GABC content
 * @property {string} labelKey - Translation key for variant label (e.g., 'ui-sundays-feasts')
 * @property {string} translationKey - Key for translation lookup
 */

/**
 * Versicle section with variants
 * @typedef {Object} VersicleSection
 * @property {'versicle'} type
 * @property {VersicleVariant[]} variants - Array of versicle variants
 */

/**
 * Canticle with antiphon section (Magnificat, Benedictus, Nunc dimittis)
 * @typedef {Object} CanticleWithAntiphonSection
 * @property {'canticle-with-antiphon'} type
 * @property {string} canticleId - ID of the canticle GABC
 * @property {string} canticleLabelKey - Translation key for canticle label
 * @property {string} antiphonKey - ID of the antiphon GABC (use incipit)
 * @property {string} translationKey - Key for canticle translation
 */

/**
 * Closing item (prayers at end)
 * @typedef {Object} ClosingItem
 * @property {string} gabcId - ID of the GABC content
 * @property {string} translationKey - Key for translation lookup
 */

/**
 * Closing section
 * @typedef {Object} ClosingSection
 * @property {'closing'} type
 * @property {ClosingItem[]} items - Array of closing prayers
 */

/**
 * Any section type
 * @typedef {OpeningSection|PsalmWithAntiphonSection|ChapterSection|HymnSection|VersicleSection|CanticleWithAntiphonSection|ClosingSection} Section
 */

/**
 * Seasonal overrides for different liturgical periods
 * @typedef {Object} SeasonalOverride
 * @property {string} [hymn] - Override hymn gabcId
 * @property {Object.<string, string>} [antiphons] - Map of antiphon key to override gabcId
 */

/**
 * Hour definition
 * @typedef {Object} HourDefinition
 * @property {string} id - Unique identifier for the hour (e.g., 'vespers', 'lauds')
 * @property {string} nameKey - Translation key for hour name lookup
 * @property {string} [descriptionKey] - Translation key for hour description (optional)
 * @property {Section[]} structure - Ordered array of sections
 * @property {Object.<number, SeasonalOverride>} [seasonal] - Office-specific overrides keyed by office number
 */

/**
 * Translation entry
 * @typedef {Object} TranslationEntry
 * @property {string} [en] - English translation
 * @property {string} [cs] - Czech translation
 */

/**
 * Translations object - maps keys to translation entries
 * @typedef {Object.<string, TranslationEntry>} Translations
 */

// Export empty object to make this a module
export {};

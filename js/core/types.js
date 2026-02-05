/**
 * Type Definitions for Hour Structure
 *
 * These JSDoc typedefs serve as contracts/interfaces for the hour data structure.
 * They provide IDE autocompletion and serve as documentation.
 *
 * The type system uses 5 functional types that describe rendering behavior:
 * - chant: Single chant with optional label
 * - chants-with-antiphon: Multiple chants wrapped by antiphon (before first, after last)
 * - chant-variants: Multiple alternative chants
 * - chant-sequence: Array of chants in order
 * - dynamic: Runtime-resolved content
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
 * Single chant with optional label
 * Used for: bare chants (opening), labeled chants (psalm, hymn, chapter)
 * @typedef {Object} ChantSection
 * @property {'chant'} type
 * @property {string} gabcId - GABC content ID
 * @property {string} translationKey - Translation lookup key
 * @property {string} [id] - Wrapper element ID (for anchoring)
 * @property {string} [labelKey] - Omit for bare chant, include for labeled
 * @property {string} [incipit] - Latin text after label (e.g., "Dixit dominus")
 * @property {string} [reference] - Scripture reference (e.g., "Ecclus. xxiv. 14")
 */

/**
 * Individual chant item in a chants-with-antiphon section
 * Note: Intentionally minimal subset rather than reusing ChantSection,
 * as these items don't need type, id, or reference fields
 * @typedef {Object} ChantItem
 * @property {string} gabcId - GABC content ID
 * @property {string} translationKey - Translation lookup key
 * @property {string} labelKey - Label for the chant (e.g., 'ui-psalm-109')
 * @property {string} [incipit] - Latin incipit (e.g., "Dixit dominus")
 */

/**
 * Multiple chants wrapped by antiphon (before first and after last)
 * Used for: psalm-with-antiphon, canticle-with-antiphon
 * @typedef {Object} ChantsWithAntiphonSection
 * @property {'chants-with-antiphon'} type
 * @property {ChantItem[]} chants - Array of chants (1 or more)
 * @property {string} antiphonKey - Antiphon GABC ID (uses Latin incipit)
 * @property {string} [id] - Wrapper element ID, defaults to antiphonKey
 */

/**
 * Variant item for chant-variants section
 * @typedef {Object} ChantVariantItem
 * @property {string} gabcId - GABC content ID
 * @property {string} labelKey - Translation key for variant label
 * @property {string} translationKey - Translation lookup key
 */

/**
 * Multiple alternative chants (e.g., solemn vs simple versicles)
 * @typedef {Object} ChantVariantsSection
 * @property {'chant-variants'} type
 * @property {ChantVariantItem[]} variants - Array of variant chants
 * @property {string} [id] - Wrapper element ID
 */

/**
 * Item in a chant sequence
 * @typedef {Object} ChantSequenceItem
 * @property {string} gabcId - GABC content ID
 * @property {string} translationKey - Translation lookup key
 */

/**
 * Array of chants rendered in sequence
 * Used for: closing prayers
 * @typedef {Object} ChantSequenceSection
 * @property {'chant-sequence'} type
 * @property {ChantSequenceItem[]} items - Array of chants in order
 * @property {string} [id] - Wrapper element ID
 */

/**
 * Resolver result item - what resolvers return
 * @typedef {Object} ResolverResultItem
 * @property {string} gabcId - GABC content ID
 * @property {string} translationKey - Translation lookup key
 */

/**
 * Runtime-resolved content (e.g., seasonal Marian antiphon)
 * Resolvers return an array of { gabcId, translationKey } objects
 * @typedef {Object} DynamicSection
 * @property {'dynamic'} type
 * @property {string} resolver - Name of resolver function in registry
 * @property {string} [labelKey] - Optional label translation key
 * @property {string} [id] - Wrapper element ID
 */

/**
 * Any section type
 * @typedef {ChantSection|ChantsWithAntiphonSection|ChantVariantsSection|ChantSequenceSection|DynamicSection} Section
 */

/**
 * Seasonal overrides for different liturgical periods
 * Overrides target gabcId or antiphonKey values by mapping old ID to new ID
 * @typedef {Object} SeasonalOverride
 * @property {Object.<string, string>} [overrides] - Map of gabcId/antiphonKey to replacement gabcId
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

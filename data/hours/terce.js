/**
 * Terce Hour Definition
 *
 * Defines the structure and content of Terce (Third Hour)
 * @see {import('../../js/core/types.js').HourDefinition}
 */

export const terce = {
  id: "terce",
  nameKey: "ui-hour-terce",
  descriptionKey: "ui-description-terce",

  // Structure defines the order of sections
  structure: [
    {
      type: "chant",
      gabcId: "Deus-in-adjutorium",
      translationKey: "Deus-in-adjutorium",
      id: "intro",
    },

    {
      type: "chant",
      gabcId: "memento-rerum-conditor",
      translationKey: "memento-rerum-conditor",
      labelKey: "ui-hymn",
      id: "hymnus",
    },

    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-119",
          translationKey: "psalm-119",
          labelKey: "ui-psalm-119",
          incipit: "Ad Dominum",
        },
        {
          gabcId: "psalm-120",
          translationKey: "psalm-120",
          labelKey: "ui-psalm-120",
          incipit: "Levavi oculos",
        },
        {
          gabcId: "psalm-121-8g",
          translationKey: "psalm-121",
          labelKey: "ui-psalm-121",
          incipit: "Lætatus sum in his",
        },
      ],
      antiphonKey: "maria-virgo-assumpta-est",
      id: "psalms",
    },

    {
      type: "chant",
      gabcId: "et-sic-in-sion",
      translationKey: "et-sic-in-sion",
      labelKey: "ui-little-chapter",
      reference: "Ecclus. xxiv. 15.",
      id: "reading",
    },

    {
      type: "chant-variants",
      variants: [
        {
          gabcId: "diffusa-est-gratia-solemn",
          labelKey: "ui-sundays-feasts",
          translationKey: "diffusa-est-gratia",
        },
        {
          gabcId: "diffusa-est-gratia-simple",
          labelKey: "ui-other-times",
          translationKey: "diffusa-est-gratia",
        },
      ],
      id: "versicle",
    },

    {
      type: "chant-sequence",
      id: "end",
      items: [
        { gabcId: "Domine-exaudi", translationKey: "Domine-exaudi" },
        {
          gabcId: "Deus-qui-salutis-aeternae",
          translationKey: "Deus-qui-salutis-aeternae",
        },
        { gabcId: "Domine-exaudi", translationKey: "Domine-exaudi" },
        { gabcId: "benedicamus", translationKey: "benedicamus" },
      ],
    },
  ],

  // Seasonal overrides for Office 2 (Advent) and Office 3 (Christmas)
  // These will contain antiphon/hymn changes when that content is added
  seasonal: {
    1: {
      // Office 1 (Ordinary) - default content, no overrides needed
    },
    2: {
      // Office 2 (Advent) - placeholder for antiphon/hymn changes
      // overrides: { 'memento-rerum-conditor': 'conditor-alme-siderum' }
    },
    3: {
      // Office 3 (Christmas to Purification) - placeholder
      // overrides: { 'memento-rerum-conditor': 'jesu-redemptor-omnium' }
    },
  },
};

export default terce;

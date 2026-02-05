/**
 * Prime Hour Definition
 *
 * Defines the structure and content of Prime (First Hour)
 * @see {import('../../js/core/types.js').HourDefinition}
 */

export const prime = {
  id: "prime",
  nameKey: "ui-hour-prime",
  descriptionKey: "ui-description-prime",

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
          gabcId: "psalm-53",
          translationKey: "psalm-53",
          labelKey: "ui-psalm-53",
          incipit: "Deus, in nomine tuo",
        },
        {
          gabcId: "psalm-84",
          translationKey: "psalm-84",
          labelKey: "ui-psalm-84",
          incipit: "Benedixisti, Domine",
        },
        {
          gabcId: "psalm-116",
          translationKey: "psalm-116",
          labelKey: "ui-psalm-116",
          incipit: "Laudate Dominum",
        },
      ],
      antiphonKey: "assumpta-est-maria-in-cælum",
      id: "psalms",
    },

    {
      type: "chant",
      gabcId: "que-est-ista",
      translationKey: "que-est-ista",
      labelKey: "ui-little-chapter",
      reference: "Cant. vi. 9.",
      id: "reading",
    },

    {
      type: "chant-variants",
      variants: [
        {
          gabcId: "dignare-me-solemn",
          labelKey: "ui-sundays-feasts",
          translationKey: "dignare-me",
        },
        {
          gabcId: "dignare-me-simple",
          labelKey: "ui-other-times",
          translationKey: "dignare-me",
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
          gabcId: "Deus-qui-virginalem",
          translationKey: "Deus-qui-virginalem",
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

export default prime;

/**
 * None Hour Definition
 *
 * Defines the structure and content of None (Ninth Hour)
 * @see {import('../../js/core/types.js').HourDefinition}
 */

export const none = {
  id: "none",
  nameKey: "ui-hour-none",
  descriptionKey: "ui-description-none",

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
          gabcId: "psalm-125",
          translationKey: "psalm-125",
          labelKey: "ui-psalm-125",
          incipit: "In convertendo",
        },
        {
          gabcId: "psalm-126-1g2",
          translationKey: "psalm-126",
          labelKey: "ui-psalm-126",
          incipit: "Nisi Dominus",
        },
        {
          gabcId: "psalm-127",
          translationKey: "psalm-127",
          labelKey: "ui-psalm-127",
          incipit: "Beati omnes",
        },
      ],
      antiphonKey: "pulchra-es-et-decora",
      id: "psalms",
    },

    {
      type: "chant",
      gabcId: "in-plateis",
      translationKey: "in-plateis",
      labelKey: "ui-little-chapter",
      reference: "Ecclus. xxiv. 19,20.",
      id: "reading",
    },

    {
      type: "chant-variants",
      variants: [
        {
          gabcId: "post-partum-virgo-solemn",
          labelKey: "ui-sundays-feasts",
          translationKey: "post-partum-virgo",
        },
        {
          gabcId: "post-partum-virgo-simple",
          labelKey: "ui-other-times",
          translationKey: "post-partum-virgo",
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
          gabcId: "famulorum-tuorum-quaesumus-Domine",
          translationKey: "famulorum-tuorum-quaesumus-Domine",
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

export default none;

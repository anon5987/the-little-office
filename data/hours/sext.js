/**
 * Sext Hour Definition
 *
 * Defines the structure and content of Sext (Sixth Hour)
 * @see {import('../../js/core/types.js').HourDefinition}
 */

export const sext = {
  id: "sext",
  nameKey: "ui-hour-sext",
  descriptionKey: "ui-description-sext",

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
          gabcId: "psalm-122",
          translationKey: "psalm-122",
          labelKey: "ui-psalm-122",
          incipit: "Ad te levavi",
        },
        {
          gabcId: "psalm-123",
          translationKey: "psalm-123",
          labelKey: "ui-psalm-123",
          incipit: "Nisi quia Dominus",
        },
        {
          gabcId: "psalm-124",
          translationKey: "psalm-124",
          labelKey: "ui-psalm-124",
          incipit: "Qui confidunt",
        },
      ],
      antiphonKey: "in-odorem",
      id: "psalms",
    },
    {
      type: "separator",
    },
    {
      type: "chant",
      gabcId: "",
      translationKey: "",
      labelKey: "ui-little-chapter",
      reference: "Ecclus. xxiv. 16.",
      id: "reading",
    },

    {
      type: "chant-variants",
      variants: [
        {
          gabcId: "benedicta-tu-solemn",
          labelKey: "ui-sundays-feasts",
          translationKey: "benedicta-tu",
        },
        {
          gabcId: "benedicta-tu-simple",
          labelKey: "ui-other-times",
          translationKey: "benedicta-tu",
        },
      ],
      id: "versicle",
    },
    {
      type: "separator",
    },
    {
      type: "chant-sequence",
      id: "end",
      items: [
        { gabcId: "Domine-exaudi", translationKey: "Domine-exaudi" },
        {
          gabcId: "concede-misericors-Deus",
          translationKey: "concede-misericors-Deus",
        },
        { gabcId: "Domine-exaudi", translationKey: "Domine-exaudi" },
        { gabcId: "benedicamus", translationKey: "benedicamus" },
      ],
    },
    {
      type: "navigation",
      targetHour: "vespers",
      id: "next-hour",
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

export default sext;

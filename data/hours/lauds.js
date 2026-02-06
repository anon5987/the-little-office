/**
 * Lauds Hour Definition
 *
 * Defines the structure and content of Lauds (Morning Prayer)
 * @see {import('../../js/core/types.js').HourDefinition}
 */

export const lauds = {
  id: "lauds",
  nameKey: "ui-hour-lauds",

  // Structure defines the order of sections
  structure: [
    {
      type: "chant",
      gabcId: "Deus-in-adjutorium",
      translationKey: "Deus-in-adjutorium",
      id: "intro",
    },
    {
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-92",
          translationKey: "psalm-92",
          labelKey: "ui-psalm-92",
          incipit: "Dominus regnavit",
        },
      ],
      antiphonKey: "assumpta-est-maria-in-cælum",
    },
    {
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-99",
          translationKey: "psalm-99",
          labelKey: "ui-psalm-99",
          incipit: "Jubilate Deo",
        },
      ],
      antiphonKey: "maria-virgo-assumpta-est",
    },
    {
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-62",
          translationKey: "psalm-62",
          labelKey: "ui-psalm-62",
          incipit: "Deus, Deus meus",
        },
      ],
      antiphonKey: "in-odorem",
    },
    {
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "the-benedicite",
          translationKey: "the-benedicite",
          labelKey: "ui-the-benedicite",
          incipit: "Benedicite",
        },
      ],
      antiphonKey: "benedicta-filia-tu",
    },
    {
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-148",
          translationKey: "psalm-148",
          labelKey: "ui-psalm-148",
          incipit: "Laudate Dominum",
        },
      ],
      antiphonKey: "pulchra-es-et-decora",
    },
    {
      type: "separator",
    },
    {
      type: "chant",
      gabcId: "viderunt-eam",
      translationKey: "viderunt-eam",
      labelKey: "ui-little-chapter",
      reference: "Cant. vi. 8",
      id: "reading",
    },
    {
      type: "separator",
    },
    {
      type: "chant",
      gabcId: "o-gloriosa-virginum",
      translationKey: "o-gloriosa-virginum",
      labelKey: "ui-hymn",
      id: "hymnus",
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
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "benedictus",
          translationKey: "benedictus-chant",
          labelKey: "ui-benedictus",
        },
      ],
      antiphonKey: "beata-dei-genitrix",
      id: "canticle",
    },
    {
      type: "separator",
    },
    {
      type: "chant-sequence",
      id: "end",
      items: [
        { gabcId: "Domine-exaudi", translationKey: "Domine-exaudi" },
        { gabcId: "Deus-qui-de-beatae", translationKey: "Deus-qui-de-beatae" },
        { gabcId: "Domine-exaudi", translationKey: "Domine-exaudi" },
        { gabcId: "benedicamus", translationKey: "benedicamus" },
      ],
    },
    {
      type: "navigation",
      targetHour: "prime",
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
      // overrides: { 'o-gloriosa-virginum': 'conditor-alme-siderum' }
    },
    3: {
      // Office 3 (Christmas to Purification) - placeholder
      // overrides: { 'o-gloriosa-virginum': 'jesu-redemptor-omnium' }
    },
  },
};

export default lauds;

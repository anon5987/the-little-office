/**
 * Lauds Hour Definition
 *
 * Defines the structure and content of Lauds (Evening Prayer)
 */

export const lauds = {
  id: "lauds",
  nameKey: "ui-hour-lauds",

  // Structure defines the order of sections
  structure: [
    {
      type: "opening",
      gabcId: "deus-in-adjutorium",
      translationKey: "Deus-in-adjutorium",
    },
    {
      type: "psalm-with-antiphon",
      psalmId: "psalm-92",
      psalmLabelKey: "ui-psalm-92",
      psalmIncipit: "Dominus regnavit",
      antiphonKey: "assumpta-est-maria-in-cælum",
    },
    {
      type: "psalm-with-antiphon",
      psalmId: "psalm-99",
      psalmLabelKey: "ui-psalm-99",
      psalmIncipit: "Jubilate Deo",
      antiphonKey: "maria-virgo-assumpta-est",
    },
    {
      type: "psalm-with-antiphon",
      psalmId: "psalm-62",
      psalmLabelKey: "ui-psalm-62",
      psalmIncipit: "Deus, Deus meus",
      antiphonKey: "in-odorem",
    },
    {
      type: "psalm-with-antiphon",
      psalmId: "the-benedicite",
      psalmLabelKey: "ui-the-benedicite",
      psalmIncipit: "Benedicite",
      antiphonKey: "benedicta-filia-tu",
    },
    {
      type: "psalm-with-antiphon",
      psalmId: "psalm-148",
      psalmLabelKey: "ui-psalm-148",
      psalmIncipit: "Laudate Dominum",
      antiphonKey: "pulchra-es-et-decora",
    },
    {
      type: "chapter",
      gabcId: "viderunt-eam",
      labelKey: "ui-little-chapter",
      reference: "Cant. vi. 8",
      translationKey: "viderunt-eam",
    },
    {
      type: "hymn",
      gabcId: "o-gloriosa-virginum",
      labelKey: "ui-hymn",
      translationKey: "o-gloriosa-virginum",
    },
    {
      type: "versicle",
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
    },
    {
      type: "canticle-with-antiphon",
      canticleId: "benedictus",
      canticleLabelKey: "ui-benedictus",
      antiphonKey: "beata-dei-genitrix",
      translationKey: "benedictus-chant",
    },
    {
      type: "closing",
      items: [
        { gabcId: "domine-exaudi", translationKey: "domine-exaudi" },
        { gabcId: "deus-qui-de-beatae", translationKey: "deus-qui-de-beatae" },
        { gabcId: "domine-exaudi", translationKey: "domine-exaudi" },
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
      // hymn: 'conditor-alme-siderum',
      // antiphons: { ... }
    },
    3: {
      // Office 3 (Christmas to Purification) - placeholder
      // hymn: 'jesu-redemptor-omnium',
      // antiphons: { ... }
    },
  },
};

export default lauds;

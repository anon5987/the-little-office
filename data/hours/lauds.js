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
      gabcId: "deus-in-adjutorium",
      translationKey: "Deus-in-adjutorium",
      id: "intro"
    },
    {
      type: "chant-with-antiphon",
      mainGabcId: "psalm-92",
      mainTranslationKey: "psalm-92",
      mainLabelKey: "ui-psalm-92",
      mainIncipit: "Dominus regnavit",
      antiphonKey: "assumpta-est-maria-in-cælum"
    },
    {
      type: "chant-with-antiphon",
      mainGabcId: "psalm-99",
      mainTranslationKey: "psalm-99",
      mainLabelKey: "ui-psalm-99",
      mainIncipit: "Jubilate Deo",
      antiphonKey: "maria-virgo-assumpta-est"
    },
    {
      type: "chant-with-antiphon",
      mainGabcId: "psalm-62",
      mainTranslationKey: "psalm-62",
      mainLabelKey: "ui-psalm-62",
      mainIncipit: "Deus, Deus meus",
      antiphonKey: "in-odorem"
    },
    {
      type: "chant-with-antiphon",
      mainGabcId: "the-benedicite",
      mainTranslationKey: "the-benedicite",
      mainLabelKey: "ui-the-benedicite",
      mainIncipit: "Benedicite",
      antiphonKey: "benedicta-filia-tu"
    },
    {
      type: "chant-with-antiphon",
      mainGabcId: "psalm-148",
      mainTranslationKey: "psalm-148",
      mainLabelKey: "ui-psalm-148",
      mainIncipit: "Laudate Dominum",
      antiphonKey: "pulchra-es-et-decora"
    },
    {
      type: "chant",
      gabcId: "viderunt-eam",
      translationKey: "viderunt-eam",
      labelKey: "ui-little-chapter",
      reference: "Cant. vi. 8",
      id: "reading"
    },
    {
      type: "chant",
      gabcId: "o-gloriosa-virginum",
      translationKey: "o-gloriosa-virginum",
      labelKey: "ui-hymn",
      id: "hymnus"
    },
    {
      type: "chant-variants",
      variants: [
        {
          gabcId: "benedicta-tu-solemn",
          labelKey: "ui-sundays-feasts",
          translationKey: "benedicta-tu"
        },
        {
          gabcId: "benedicta-tu-simple",
          labelKey: "ui-other-times",
          translationKey: "benedicta-tu"
        }
      ],
      id: "versicle"
    },
    {
      type: "chant-with-antiphon",
      mainGabcId: "benedictus",
      mainTranslationKey: "benedictus-chant",
      mainLabelKey: "ui-benedictus",
      antiphonKey: "beata-dei-genitrix",
      id: "canticle"
    },
    {
      type: "chant-sequence",
      id: "end",
      items: [
        { gabcId: "domine-exaudi", translationKey: "domine-exaudi" },
        { gabcId: "deus-qui-de-beatae", translationKey: "deus-qui-de-beatae" },
        { gabcId: "domine-exaudi", translationKey: "domine-exaudi" },
        { gabcId: "benedicamus", translationKey: "benedicamus" }
      ]
    }
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
    }
  }
};

export default lauds;

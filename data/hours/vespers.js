/**
 * Vespers Hour Definition
 *
 * Defines the structure and content of Vespers (Evening Prayer)
 * @see {import('../../js/core/types.js').HourDefinition}
 */

export const vespers = {
  id: "vespers",
  nameKey: "ui-hour-vespers",
  descriptionKey: "ui-description-vespers",

  // Structure defines the order of sections
  structure: [
    {
      type: "chant",
      gabcId: "Deus-in-adjutorium",
      translationKey: "Deus-in-adjutorium",
      id: "intro",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-109",
          translationKey: "psalm-109",
          labelKey: "ui-psalm-109",
          incipit: "Dixit dominus",
        },
      ],
      antiphonKey: "dum-esset-rex",
    },
    {
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-112",
          translationKey: "psalm-112",
          labelKey: "ui-psalm-112",
          incipit: "Laudate pueri",
        },
      ],
      antiphonKey: "laeva-ejus",
    },
    {
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-121-3b",
          translationKey: "psalm-121",
          labelKey: "ui-psalm-121",
          incipit: "Laetatus sum",
        },
      ],
      antiphonKey: "nigra-sum",
    },
    {
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-126-8g",
          translationKey: "psalm-126",
          labelKey: "ui-psalm-126",
          incipit: "Nisi Dominus",
        },
      ],
      antiphonKey: "jam-hiems",
    },
    {
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "psalm-147",
          translationKey: "psalm-147",
          labelKey: "ui-psalm-147",
          incipit: "Lauda Jerusalem",
        },
      ],
      antiphonKey: "speciosa-facta-es",
    },
    {
      type: "separator",
    },
    {
      type: "chant",
      gabcId: "ab-initio",
      translationKey: "ab-initio",
      labelKey: "ui-little-chapter",
      reference: "Ecclus. xxiv. 14",
      id: "reading",
    },
    {
      type: "separator",
    },
    {
      type: "chant",
      gabcId: "ave-maris-stella",
      translationKey: "ave-maris-stella",
      labelKey: "ui-hymn",
      id: "hymnus",
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
      type: "separator",
    },
    {
      type: "chants-with-antiphon",
      chants: [
        {
          gabcId: "magnificat-chant",
          translationKey: "magnificat-chant",
          labelKey: "ui-magnificat",
        },
      ],
      antiphonKey: "beata-mater",
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
        {
          gabcId: "concede-nos-famulos",
          translationKey: "concede-nos-famulos",
        },
        { gabcId: "Domine-exaudi", translationKey: "Domine-exaudi" },
        { gabcId: "benedicamus", translationKey: "benedicamus" },
      ],
    },
    {
      type: "navigation",
      targetHour: "compline",
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
      // overrides: { 'ave-maris-stella': 'conditor-alme-siderum' }
    },
    3: {
      // Office 3 (Christmas to Purification) - placeholder
      // overrides: { 'ave-maris-stella': 'jesu-redemptor-omnium' }
    },
  },
};

export default vespers;

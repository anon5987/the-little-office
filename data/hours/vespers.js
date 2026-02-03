/**
 * Vespers Hour Definition
 *
 * Defines the structure and content of Vespers (Evening Prayer)
 * @see {import('../../js/core/types.js').HourDefinition}
 */

export const vespers = {
  id: 'vespers',
  nameKey: 'ui-hour-vespers',
  descriptionKey: 'ui-description-vespers',

  // Structure defines the order of sections
  structure: [
    {
      type: 'chant',
      gabcId: 'deus-in-adjutorium',
      translationKey: 'Deus-in-adjutorium',
      id: 'intro'
    },
    {
      type: 'chant-with-antiphon',
      mainGabcId: 'psalm-109',
      mainTranslationKey: 'psalm-109',
      mainLabelKey: 'ui-psalm-109',
      mainIncipit: 'Dixit dominus',
      antiphonKey: 'dum-esset-rex'
    },
    {
      type: 'chant-with-antiphon',
      mainGabcId: 'psalm-112',
      mainTranslationKey: 'psalm-112',
      mainLabelKey: 'ui-psalm-112',
      mainIncipit: 'Laudate pueri',
      antiphonKey: 'laeva-ejus'
    },
    {
      type: 'chant-with-antiphon',
      mainGabcId: 'psalm-121',
      mainTranslationKey: 'psalm-121',
      mainLabelKey: 'ui-psalm-121',
      mainIncipit: 'Laetatus sum',
      antiphonKey: 'nigra-sum'
    },
    {
      type: 'chant-with-antiphon',
      mainGabcId: 'psalm-126',
      mainTranslationKey: 'psalm-126',
      mainLabelKey: 'ui-psalm-126',
      mainIncipit: 'Nisi Dominus',
      antiphonKey: 'jam-hiems'
    },
    {
      type: 'chant-with-antiphon',
      mainGabcId: 'psalm-147',
      mainTranslationKey: 'psalm-147',
      mainLabelKey: 'ui-psalm-147',
      mainIncipit: 'Lauda Jerusalem',
      antiphonKey: 'speciosa-facta-es'
    },
    {
      type: 'chant',
      gabcId: 'ab-initio',
      translationKey: 'ab-initio',
      labelKey: 'ui-little-chapter',
      reference: 'Ecclus. xxiv. 14',
      id: 'reading'
    },
    {
      type: 'chant',
      gabcId: 'ave-maris-stella',
      translationKey: 'ave-maris-stella',
      labelKey: 'ui-hymn',
      id: 'hymnus'
    },
    {
      type: 'chant-variants',
      variants: [
        {
          gabcId: 'diffusa-est-gratia-solemn',
          labelKey: 'ui-sundays-feasts',
          translationKey: 'diffusa-est-gratia'
        },
        {
          gabcId: 'diffusa-est-gratia-simple',
          labelKey: 'ui-other-times',
          translationKey: 'diffusa-est-gratia'
        }
      ],
      id: 'versicle'
    },
    {
      type: 'chant-with-antiphon',
      mainGabcId: 'magnificat-chant',
      mainTranslationKey: 'magnificat-chant',
      mainLabelKey: 'ui-magnificat',
      antiphonKey: 'beata-mater',
      id: 'canticle'
    },
    {
      type: 'chant-sequence',
      id: 'end',
      items: [
        { gabcId: 'domine-exaudi', translationKey: 'domine-exaudi' },
        { gabcId: 'concede-nos-famulos', translationKey: 'concede-nos-famulos' },
        { gabcId: 'domine-exaudi', translationKey: 'domine-exaudi' },
        { gabcId: 'benedicamus', translationKey: 'benedicamus' }
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
      // overrides: { 'ave-maris-stella': 'conditor-alme-siderum' }
    },
    3: {
      // Office 3 (Christmas to Purification) - placeholder
      // overrides: { 'ave-maris-stella': 'jesu-redemptor-omnium' }
    }
  }
};

export default vespers;

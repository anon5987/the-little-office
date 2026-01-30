/**
 * Vespers Hour Definition
 *
 * Defines the structure and content of Vespers (Evening Prayer)
 */

export const vespers = {
  id: 'vespers',
  name: {
    en: 'Vespers',
    cs: 'Nešpory',
    la: 'Vesperæ'
  },
  descriptionKey: 'ui-description-vespers',

  // Structure defines the order of sections
  structure: [
    {
      type: 'opening',
      gabcId: 'deus-in-adjutorium',
      translationKey: 'Deus-in-adjutorium'
    },
    {
      type: 'psalm-with-antiphon',
      psalmId: 'psalm-109',
      psalmLabelKey: 'ui-psalm-109',
      psalmIncipit: 'Dixit dominus',
      antiphonKey: 'dum-esset-rex',
      mode: '3a'
    },
    {
      type: 'psalm-with-antiphon',
      psalmId: 'psalm-112',
      psalmLabelKey: 'ui-psalm-112',
      psalmIncipit: 'Laudate pueri',
      antiphonKey: 'laeva-ejus',
      mode: '4a*'
    },
    {
      type: 'psalm-with-antiphon',
      psalmId: 'psalm-121',
      psalmLabelKey: 'ui-psalm-121',
      psalmIncipit: 'Laetatus sum',
      antiphonKey: 'nigra-sum',
      mode: '3b'
    },
    {
      type: 'psalm-with-antiphon',
      psalmId: 'psalm-126',
      psalmLabelKey: 'ui-psalm-126',
      psalmIncipit: 'Nisi Dominus',
      antiphonKey: 'jam-hiems',
      mode: '8G'
    },
    {
      type: 'psalm-with-antiphon',
      psalmId: 'psalm-147',
      psalmLabelKey: 'ui-psalm-147',
      psalmIncipit: 'Lauda Jerusalem',
      antiphonKey: 'speciosa-facta-es',
      mode: '4A*'
    },
    {
      type: 'chapter',
      gabcId: 'ecclus',
      labelKey: 'ui-little-chapter',
      reference: 'Ecclus. xxiv. 14',
      translationKey: 'ecclus'
    },
    {
      type: 'hymn',
      gabcId: 'ave-maris-stella',
      labelKey: 'ui-hymn',
      translationKey: 'ave-maris-stella'
    },
    {
      type: 'versicle',
      variants: [
        {
          gabcId: 'vr-solemn',
          labelKey: 'ui-sundays-feasts',
          translationKey: 'versicle'
        },
        {
          gabcId: 'vr-simple',
          labelKey: 'ui-other-times',
          translationKey: 'versicle'
        }
      ]
    },
    {
      type: 'canticle-with-antiphon',
      canticleId: 'magnificat-chant',
      canticleLabelKey: 'ui-magnificat',
      antiphonKey: 'beata-mater',
      mode: '2D',
      translationKey: 'magnificat-chant'
    },
    {
      type: 'closing',
      items: [
        { gabcId: 'domine-exaudi', translationKey: 'domine-exaudi' },
        { gabcId: 'oremus', translationKey: 'oremus' },
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
      // hymn: 'conditor-alme-siderum',
      // antiphons: { ... }
    },
    3: {
      // Office 3 (Christmas to Purification) - placeholder
      // hymn: 'jesu-redemptor-omnium',
      // antiphons: { ... }
    }
  }
};

export default vespers;

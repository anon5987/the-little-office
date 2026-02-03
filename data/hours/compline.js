/**
 * Compline Hour Definition
 *
 * Defines the structure and content of Compline (Night Prayer)
 * @see {import('../../js/types.js').HourDefinition}
 *
 * Unique features:
 * - Psalms without antiphon (new 'psalm' section type)
 * - Seasonal Marian antiphon at the end (dynamically selected)
 */

export const compline = {
  id: "compline",
  nameKey: "ui-hour-compline",
  descriptionKey: "ui-description-compline",

  structure: [
    {
      type: "opening",
      gabcId: "converte-nos-deus",
      translationKey: "converte-nos-Deus",
    },
    {
      type: "opening",
      gabcId: "deus-in-adjutorium",
      translationKey: "Deus-in-adjutorium",
    },

    {
      type: "psalm",
      psalmId: "psalm-128",
      psalmLabelKey: "ui-psalm-128",
      psalmIncipit: "Sæpe expugnaverunt",
    },
    {
      type: "psalm",
      psalmId: "psalm-129",
      psalmLabelKey: "ui-psalm-129",
      psalmIncipit: "De profundis",
    },
    {
      type: "psalm",
      psalmId: "psalm-130",
      psalmLabelKey: "ui-psalm-130",
      psalmIncipit: "Domine, non est",
    },

    {
      type: "hymn",
      gabcId: "memento-rerum-conditor",
      labelKey: "ui-hymn",
      translationKey: "memento-rerum-conditor",
    },

    // TODO
    {
      type: "chapter",
      gabcId: "ego-mater",
      labelKey: "ui-little-chapter",
      reference: "Ecclus. xxiv. 24.",
      translationKey: "ego-mater",
    },

    {
      type: "canticle-with-antiphon",
      canticleId: "nunc-dimittis",
      canticleLabelKey: "ui-nunc-dimittis",
      antiphonKey: "sub-tuum-praesidium",
      translationKey: "nunc-dimittis-chant",
    },

    {
      type: "closing",
      items: [
        { gabcId: "domine-exaudi", translationKey: "domine-exaudi" },
        // TODO
        {
          gabcId: "beatae-et-gloriosae",
          translationKey: "beatae-et-gloriosae",
        },
        { gabcId: "domine-exaudi", translationKey: "domine-exaudi" },
        {
          gabcId: "benedicamus-no-fidelium",
          translationKey: "benedicamus-no-fidelium",
        },
        // TODO blessing
      ],
    },

    {
      type: "marian-antiphon",
      labelKey: "ui-marian-antiphon",
    },

    // todo divinum auxilium
  ],

  seasonal: {},
};

export default compline;

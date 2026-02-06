/**
 * Compline Hour Definition
 *
 * Defines the structure and content of Compline (Night Prayer)
 * @see {import('../../js/core/types.js').HourDefinition}
 *
 * Unique features:
 * - Psalms without antiphon (unlike Vespers/Lauds where each psalm has its own antiphon)
 * - Seasonal Marian antiphon at the end (dynamic resolver)
 */

export const compline = {
  id: "compline",
  nameKey: "ui-hour-compline",
  descriptionKey: "ui-description-compline",

  structure: [
    {
      type: "chant",
      gabcId: "converte-nos-Deus",
      translationKey: "converte-nos-Deus",
      id: "converte",
    },

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
      type: "chant",
      gabcId: "psalm-128",
      translationKey: "psalm-128",
      labelKey: "ui-psalm-128",
      incipit: "Sæpe expugnaverunt",
      id: "psalm-128",
    },

    {
      type: "separator",
    },

    {
      type: "chant",
      gabcId: "psalm-129",
      translationKey: "psalm-129",
      labelKey: "ui-psalm-129",
      incipit: "De profundis",
      id: "psalm-129",
    },

    {
      type: "separator",
    },

    {
      type: "chant",
      gabcId: "psalm-130",
      translationKey: "psalm-130",
      labelKey: "ui-psalm-130",
      incipit: "Domine, non est",
      id: "psalm-130",
    },

    {
      type: "separator",
    },

    {
      type: "chant",
      gabcId: "memento-rerum-conditor",
      translationKey: "memento-rerum-conditor",
      labelKey: "ui-hymn",
      id: "hymnus",
    },

    {
      type: "separator",
    },

    {
      type: "chant",
      gabcId: "ego-mater",
      translationKey: "ego-mater",
      labelKey: "ui-little-chapter",
      reference: "Ecclus. xxiv. 24.",
      id: "reading",
    },

    {
      type: "chant-variants",
      variants: [
        {
          gabcId: "ora-pro-nobis-solemn",
          labelKey: "ui-sundays-feasts",
          translationKey: "ora-pro-nobis",
        },
        {
          gabcId: "ora-pro-nobis-simple",
          labelKey: "ui-other-times",
          translationKey: "ora-pro-nobis",
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
          gabcId: "nunc-dimittis",
          translationKey: "nunc-dimittis-chant",
          labelKey: "ui-nunc-dimittis",
        },
      ],
      antiphonKey: "sub-tuum-praesidium",
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
          gabcId: "beatae-et-gloriosae",
          translationKey: "beatae-et-gloriosae",
        },
        { gabcId: "Domine-exaudi", translationKey: "Domine-exaudi" },
        {
          gabcId: "benedicamus-benedicat",
          translationKey: "benedicamus-benedicat",
        },
      ],
    },

    {
      type: "separator",
    },

    {
      type: "dynamic",
      resolver: "marian-antiphon",
      labelKey: "ui-marian-antiphon",
      id: "marian-antiphon",
    },

    {
      type: "chant",
      gabcId: "divinum-auxilium",
      translationKey: "divinum-auxilium",
      id: "ending",
    },
  ],

  seasonal: {},
};

export default compline;

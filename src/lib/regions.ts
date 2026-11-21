export type LeonidaRegion = {
  slug: string;
  name: string;
  description: string;
  color: string;
};

export const LEONIDA_REGIONS: LeonidaRegion[] = [
  {
    slug: "vice-city",
    name: "Vice City",
    description:
      "Die Großstadt im Zentrum des Spiels, angelehnt an Miami – Schauplatz der meisten Trailer-Szenen.",
    color: "#ff2e88",
  },
  {
    slug: "leonida-keys",
    name: "Leonida Keys",
    description:
      "Inselkette südlich der Stadt, Teil von Mariana County, dem südlichen Landkreis Leonidas.",
    color: "#17d6c9",
  },
  {
    slug: "grassrivers",
    name: "Grassrivers",
    description:
      "Feuchtgebiete und Sumpflandschaft im Landesinneren, angelehnt an die Everglades.",
    color: "#2f9e6e",
  },
  {
    slug: "port-gellhorn",
    name: "Port Gellhorn",
    description:
      '"Die vergessene Küste" im Westen – heruntergekommene Ferienorte und leerstehende Attraktionen, angelehnt an Floridas Panhandle.',
    color: "#d6a84a",
  },
  {
    slug: "ambrosia",
    name: "Ambrosia",
    description:
      "Industrie- und Arbeiterregion am Lake Leonida, geprägt von der Zuckerraffinerie Allied Crystal.",
    color: "#e0763e",
  },
  {
    slug: "mount-kalaga",
    name: "Mount Kalaga",
    description:
      "Nationalpark und Wildnis im Norden mit Wäldern, Bergen und Offroad-Strecken.",
    color: "#6c1bd6",
  },
];

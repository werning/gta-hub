import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karte",
  description:
    "Übersicht über die sechs offiziell bestätigten Regionen des Bundesstaats Leonida in GTA 6.",
};

const regions = [
  {
    name: "Vice City",
    description:
      "Die Großstadt im Zentrum des Spiels, angelehnt an Miami – Schauplatz der meisten Trailer-Szenen.",
  },
  {
    name: "Leonida Keys",
    description:
      "Inselkette südlich der Stadt, Teil von Mariana County, dem südlichen Landkreis Leonidas.",
  },
  {
    name: "Grassrivers",
    description:
      "Feuchtgebiete und Sumpflandschaft im Landesinneren, angelehnt an die Everglades.",
  },
  {
    name: "Port Gellhorn",
    description:
      "\"Die vergessene Küste\" im Westen – heruntergekommene Ferienorte und leerstehende Attraktionen, angelehnt an Floridas Panhandle.",
  },
  {
    name: "Ambrosia",
    description:
      "Industrie- und Arbeiterregion am Lake Leonida, geprägt von der Zuckerraffinerie Allied Crystal.",
  },
  {
    name: "Mount Kalaga",
    description:
      "Nationalpark und Wildnis im Norden mit Wäldern, Bergen und Offroad-Strecken.",
  },
];

export default function KartePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Karte</h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Eine eigene, schematische Übersicht der sechs offiziell
          bestätigten Regionen des Bundesstaats Leonida – keine
          Spielgrafik, sondern eine selbst gestaltete Orientierungshilfe.
        </p>
      </header>

      {/* Stylised, own illustration – not game artwork */}
      <div className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#14081f] to-[#0b0414] p-6">
        <svg viewBox="0 0 400 240" className="h-56 w-full sm:h-72">
          <defs>
            <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0d5c6b" />
              <stop offset="100%" stopColor="#0b0414" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" fill="url(#water)" />
          <ellipse cx="150" cy="110" rx="110" ry="70" fill="#1d7a63" opacity="0.8" />
          <ellipse cx="270" cy="150" rx="60" ry="35" fill="#1d7a63" opacity="0.6" />
          <circle cx="150" cy="100" r="6" fill="#ff2e88" />
          <circle cx="270" cy="150" r="6" fill="#17d6c9" />
          <circle cx="200" cy="140" r="6" fill="#f5c84a" />
        </svg>
        <p className="mt-4 text-center text-xs text-white/40">
          Schematische Illustration, keine originalgetreue Spielkarte.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {regions.map((region) => (
          <div
            key={region.name}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <h2 className="font-semibold text-white">{region.name}</h2>
            <p className="mt-2 text-sm text-white/60">{region.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

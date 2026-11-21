import type { Metadata } from "next";
import { LEONIDA_REGIONS } from "@/lib/regions";
import { LeonidaMap } from "@/components/LeonidaMap";

export const metadata: Metadata = {
  title: "Karte",
  description:
    "Übersicht über die sechs offiziell bestätigten Regionen des Bundesstaats Leonida in GTA 6.",
};

export default function KartePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Karte</h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Eine eigene, stilisierte Übersicht der sechs offiziell bestätigten
          Regionen des Bundesstaats Leonida – keine Spielgrafik, sondern
          eine selbst gestaltete Orientierungshilfe. Klicke auf eine Region
          auf der Karte, um direkt zur Beschreibung zu springen.
        </p>
      </header>

      <div className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#14081f] to-[#0b0414] p-6">
        <LeonidaMap regions={LEONIDA_REGIONS} />
        <p className="mt-4 text-center text-xs text-white/40">
          Stilisierte Illustration, keine originalgetreue Spielkarte.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {LEONIDA_REGIONS.map((region) => (
          <div
            key={region.slug}
            id={region.slug}
            className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <span
              className="mb-2 inline-block h-2.5 w-2.5 rounded-full align-middle"
              style={{ backgroundColor: region.color }}
            />
            <h2 className="inline align-middle ml-2 font-semibold text-white">
              {region.name}
            </h2>
            <p className="mt-2 text-sm text-white/60">{region.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

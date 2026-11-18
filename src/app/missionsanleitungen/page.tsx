import type { Metadata } from "next";
import { ContentCard } from "@/components/ContentCard";
import { PlaceholderNotice } from "@/components/PlaceholderNotice";

export const metadata: Metadata = {
  title: "Missionsanleitungen",
  description:
    "Schritt-für-Schritt-Anleitungen zu GTA-6-Missionen – aktuell komplett kostenlos.",
};

const guides = [
  {
    href: "/missionsanleitungen",
    tag: "Hauptmission",
    title: "Beispiel: Prolog – Erste Schritte",
    excerpt: "Aktuell komplett kostenlos abrufbar.",
    meta: "Platzhalter",
  },
  {
    href: "/missionsanleitungen",
    tag: "Nebenmission",
    title: "Beispiel: Erster Kontakt",
    excerpt: "Aktuell komplett kostenlos abrufbar.",
    meta: "Platzhalter",
  },
];

export default function MissionsanleitungenPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Missionsanleitungen
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Schritt-für-Schritt-Anleitungen mit allen Details. In der
          Launch-Phase sind sie für alle komplett kostenlos – später wird ein
          Teil davon Mitgliedern vorbehalten sein.
        </p>
      </header>

      <PlaceholderNotice>
        Echte Anleitungen folgen, sobald entsprechende Inhalte verfügbar
        sind. Unten siehst du beispielhaft, wie eine vollständige Anleitung
        aussehen wird.
      </PlaceholderNotice>

      {/* Example of a full guide, currently open to everyone */}
      <article className="mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
              Hauptmission
            </span>
            <span className="rounded-full bg-[#17d6c9]/10 px-3 py-1 text-xs font-semibold text-[#8ff0e8]">
              Kostenlos in der Launch-Phase
            </span>
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white">
            Beispiel: Prolog – Erste Schritte
          </h2>
          <p className="mt-3 text-white/70">
            In dieser Anleitung zeigen wir dir den Einstieg in die
            Prolog-Mission: Startpunkt, grobes Missionsziel und worauf du zu
            Beginn achten solltest.
          </p>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-white/70">
            <li>Startpunkt der Mission und wie du sie auslöst.</li>
            <li>Das grobe Missionsziel in eigenen Worten erklärt.</li>
            <li>Worauf du zu Beginn besonders achten solltest.</li>
            <li>Was passiert, sobald mehr Details offiziell bekannt sind.</li>
          </ol>
        </div>
      </article>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide, i) => (
          <ContentCard key={i} {...guide} />
        ))}
      </div>
    </div>
  );
}

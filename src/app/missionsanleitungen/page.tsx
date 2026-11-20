import type { Metadata } from "next";
import { ContentCard } from "@/components/ContentCard";
import { getPublishedGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Missionsanleitungen",
  description:
    "Vorschau zu GTA-6-Missionen und Story aus seriösen Quellen – aktuell komplett kostenlos.",
};

export default function MissionsanleitungenPage() {
  const guides = getPublishedGuides();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Missionsanleitungen
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Seit dem Release von GTA 6 sammeln wir hier Schritt-für-Schritt-
          Anleitungen und Zusammenfassungen zu Missionen, Story und
          Charakteren aus seriösen Quellen. In der Launch-Phase sind sie
          für alle komplett kostenlos – später wird ein Teil davon
          Mitgliedern vorbehalten sein.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <ContentCard
            key={guide.slug}
            href={`/missionsanleitungen/${guide.slug}`}
            tag={guide.tag}
            title={guide.title}
            excerpt={guide.excerpt}
            meta={`Quelle: ${guide.sourceName}`}
          />
        ))}
      </div>
    </div>
  );
}

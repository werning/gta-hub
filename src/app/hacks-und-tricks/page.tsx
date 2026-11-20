import type { Metadata } from "next";
import { ContentCard } from "@/components/ContentCard";
import { PlaceholderNotice } from "@/components/PlaceholderNotice";
import { getPublishedHacks } from "@/lib/hacks";

export const metadata: Metadata = {
  title: "Hacks & Tricks",
  description:
    "Einschätzungen zu Gameplay-Mechaniken in GTA 6 aus seriösen Quellen – aktuell komplett kostenlos.",
};

export default function HacksPage() {
  const hacks = getPublishedHacks();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Hacks &amp; Tricks
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Seit dem Release von GTA 6 sammeln wir hier Tipps und Tricks zu
          Bewegung, Wirtschaft und Kampf aus seriösen Quellen – verständlich
          zusammengefasst und mit Quellenangabe.
        </p>
      </header>

      {hacks.length === 0 ? (
        <PlaceholderNotice>
          Noch keine freigegebenen Einträge. Der tägliche Workflow legt
          Entwürfe an, die zuerst unter{" "}
          <code className="text-white/80">/admin/hacks-und-tricks</code>{" "}
          freigegeben werden müssen.
        </PlaceholderNotice>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hacks.map((hack) => (
            <ContentCard
              key={hack.slug}
              href={`/hacks-und-tricks/${hack.slug}`}
              tag={hack.tag}
              title={hack.title}
              excerpt={hack.excerpt}
              meta={`Quelle: ${hack.sourceName}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

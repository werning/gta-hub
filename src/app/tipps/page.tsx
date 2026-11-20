import type { Metadata } from "next";
import { ContentCard } from "@/components/ContentCard";
import { PlaceholderNotice } from "@/components/PlaceholderNotice";
import { getPublishedTipps } from "@/lib/tipps";

export const metadata: Metadata = {
  title: "Tipps",
  description:
    "Praktische Tipps rund um GTA 6 aus seriösen Quellen – verständlich erklärt.",
};

export default function TippsPage() {
  const tipps = getPublishedTipps();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Tipps</h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Praktische, verständliche Tipps – egal ob du Neuling oder
          Langzeitfan der Reihe bist.
        </p>
      </header>

      {tipps.length === 0 ? (
        <PlaceholderNotice>
          Noch keine freigegebenen Einträge. Der tägliche Workflow legt
          Entwürfe an, die zuerst unter{" "}
          <code className="text-white/80">/admin/tipps</code> freigegeben
          werden müssen.
        </PlaceholderNotice>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tipps.map((tipp) => (
            <ContentCard
              key={tipp.slug}
              href={`/tipps/${tipp.slug}`}
              tag={tipp.tag}
              title={tipp.title}
              excerpt={tipp.excerpt}
              meta={`Quelle: ${tipp.sourceName}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

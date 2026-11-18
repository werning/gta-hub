import type { Metadata } from "next";
import { ContentCard } from "@/components/ContentCard";
import { PlaceholderNotice } from "@/components/PlaceholderNotice";

export const metadata: Metadata = {
  title: "Hacks & Tricks",
  description: "Clevere Mechaniken und Vorgehensweisen für GTA 6.",
};

const items = [
  {
    href: "/hacks-und-tricks",
    tag: "Bewegung",
    title: "Beispiel: Schneller durch Leonida vorankommen",
    excerpt:
      "Welche Fortbewegungsmittel sich laut bisherigen Informationen am meisten lohnen.",
    meta: "Platzhalter",
  },
  {
    href: "/hacks-und-tricks",
    tag: "Wirtschaft",
    title: "Beispiel: Geld sinnvoll einsetzen",
    excerpt:
      "Erste Einschätzungen zu Wirtschaftssystemen, sobald sie bestätigt sind.",
    meta: "Platzhalter",
  },
  {
    href: "/hacks-und-tricks",
    tag: "Kampf",
    title: "Beispiel: Deckung und Gunplay richtig nutzen",
    excerpt: "Grundlegende Taktiken, die sich aus Trailern ableiten lassen.",
    meta: "Platzhalter",
  },
];

export default function HacksPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Hacks &amp; Tricks
        </h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Clevere Vorgehensweisen und Mechaniken – sauber getrennt zwischen
          bestätigten Fakten und begründeten Einschätzungen.
        </p>
      </header>

      <PlaceholderNotice>
        Hier stehen aktuell Platzhalter. Inhalte werden ergänzt, sobald
        verlässliche Informationen bzw. das Spiel selbst verfügbar sind.
      </PlaceholderNotice>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <ContentCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

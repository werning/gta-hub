import type { Metadata } from "next";
import { ContentCard } from "@/components/ContentCard";
import { PlaceholderNotice } from "@/components/PlaceholderNotice";

export const metadata: Metadata = {
  title: "Tipps",
  description: "Praktische Tipps rund um GTA 6 – verständlich erklärt.",
};

const items = [
  {
    href: "/tipps",
    tag: "Technik",
    title: "Beispiel: Welche Plattform passt zu dir?",
    excerpt:
      "Ein Vergleich der angekündigten Plattformen und was das für dich bedeutet.",
    meta: "Platzhalter",
  },
  {
    href: "/tipps",
    tag: "Vorbestellung",
    title: "Beispiel: Lohnt sich eine Vorbestellung?",
    excerpt: "Vor- und Nachteile einfach erklärt, ohne Kaufdruck.",
    meta: "Platzhalter",
  },
  {
    href: "/tipps",
    tag: "Einsteiger",
    title: "Beispiel: So bereitest du dich als Einsteiger vor",
    excerpt:
      "Grundlagen für alle, die neu in der GTA-Reihe sind oder lange pausiert haben.",
    meta: "Platzhalter",
  },
];

export default function TippsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Tipps</h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Praktische, verständliche Tipps – egal ob du Neuling oder
          Langzeitfan der Reihe bist.
        </p>
      </header>

      <PlaceholderNotice>
        Platzhalterinhalte. Werden laufend durch echte Tipps ersetzt und
        ergänzt.
      </PlaceholderNotice>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <ContentCard key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

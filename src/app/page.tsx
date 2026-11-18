import Link from "next/link";
import { ContentCard } from "@/components/ContentCard";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, var(--brand-purple) 0%, transparent 60%), radial-gradient(40% 40% at 85% 20%, var(--brand-pink) 0%, transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium tracking-wide text-white/70 uppercase">
            Inoffizielle Fan-Community
          </p>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Willkommen in{" "}
            <span className="bg-gradient-to-r from-[#ff2e88] to-[#17d6c9] bg-clip-text text-transparent">
              Leonida Living
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/70 sm:text-lg">
            Deine Anlaufstelle für GTA 6: täglich frische News, Hacks &amp;
            Tricks, Tipps, Missionsanleitungen und eine interaktive Karte –
            übersichtlich, mobil und schnell.
          </p>
          <p className="mx-auto mt-5 inline-block rounded-full border border-[#17d6c9]/40 bg-[#17d6c9]/10 px-4 py-1.5 text-sm font-medium text-[#8ff0e8]">
            🎉 Launch-Phase: alle Inhalte 30 Tage lang komplett kostenlos
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/premium"
              className="w-full rounded-full bg-gradient-to-r from-[#ff2e88] to-[#6c1bd6] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff2e88]/25 transition-transform hover:scale-105 sm:w-auto"
            >
              Jetzt kostenlos dabei sein
            </Link>
            <Link
              href="/news"
              className="w-full rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 sm:w-auto"
            >
              Neueste News ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Content sections overview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-white">
            Alles an einem Ort
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ContentCard
            href="/news"
            tag="News"
            title="Täglich neue GTA 6 News"
            excerpt="Kurz zusammengefasst, in eigenen Worten, immer mit Quellenangabe – kein Clickbait."
          />
          <ContentCard
            href="/hacks-und-tricks"
            tag="Hacks & Tricks"
            title="Vorteile verschaffen"
            excerpt="Mechaniken, Systeme und clevere Vorgehensweisen, sobald sie bestätigt oder spielbar sind."
          />
          <ContentCard
            href="/tipps"
            tag="Tipps"
            title="Gut vorbereitet starten"
            excerpt="Technische Voraussetzungen, Vorbestellungen und Einsteiger-Tipps verständlich erklärt."
          />
          <ContentCard
            href="/missionsanleitungen"
            tag="Missionsanleitungen"
            title="Schritt-für-Schritt-Guides"
            excerpt="Aktuell komplett kostenlos – später vollständige Anleitungen für Mitglieder."
          />
          <ContentCard
            href="/karte"
            tag="Karte"
            title="Leonida erkunden"
            excerpt="Alle bekannten Orte, Städte und Regionen auf einen Blick."
          />
          <ContentCard
            href="/premium"
            tag="Launch-Phase"
            title="30 Tage kostenlos dabei sein"
            excerpt="Hilf mit, die Community aufzubauen – alle Inhalte sind aktuell frei zugänglich."
          />
        </div>
      </section>

      {/* Transparency about the daily content pipeline */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-white">
            Woher kommen unsere News?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/60">
            Jeden Tag sichten wir seriöse Gaming-News-Quellen zu GTA 6 und
            fassen die Entwicklungen in eigenen Worten zusammen – nichts wird
            kopiert, nichts wird erfunden. Jeder Artikel verlinkt am Ende auf
            die Originalquelle.
          </p>
        </div>
      </section>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Impressum</h1>

      <div className="mt-6 rounded-xl border border-dashed border-[#ff8fc0]/40 bg-[#ff2e88]/5 px-4 py-3 text-sm text-white/70">
        <strong className="text-white">Vorlage, kein Rechtsrat.</strong> Trage
        überall, wo{" "}
        <code className="text-white/90">[in eckigen Klammern]</code> steht,
        deine echten Angaben ein, bevor die Seite öffentlich online geht.
        Ein Impressum ist in Deutschland für Seiten mit geschäftsmäßigem
        Charakter – auch bei geplanter Monetarisierung – gesetzlich
        vorgeschrieben (§ 5 Digitale-Dienste-Gesetz, § 18 Abs. 2
        Medienstaatsvertrag). Lass den fertigen Text im Zweifel einmal
        gegenprüfen, z. B. mit einem kostenlosen Impressum-Generator oder
        durch eine Rechtsberatung.
      </div>

      <section className="mt-8 space-y-6 text-white/80">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Angaben gemäß § 5 DDG
          </h2>
          <p className="mt-2">
            [Vor- und Nachname]
            <br />
            [Straße und Hausnummer]
            <br />
            [Postleitzahl und Ort]
            <br />
            [Land]
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">Kontakt</h2>
          <p className="mt-2">
            E-Mail: [deine-email@beispiel.de]
            <br />
            Telefon: [optional, aber empfohlen]
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-2">
            [Vor- und Nachname]
            <br />
            [Straße und Hausnummer]
            <br />
            [Postleitzahl und Ort]
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            EU-Streitschlichtung
          </h2>
          <p className="mt-2">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8ff0e8] hover:underline"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse findest du oben. Wir sind nicht
            verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor
            einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Haftung für Inhalte
          </h2>
          <p className="mt-2">
            Diese Seite ist eine inoffizielle Fan-Community-Seite und steht in
            keiner Verbindung zu Rockstar Games oder Take-Two Interactive.
            News-Artikel sind eigene Zusammenfassungen, die auf öffentlich
            zugänglichen Quellen beruhen; jede Quelle ist beim jeweiligen
            Artikel verlinkt. Trotz sorgfältiger inhaltlicher Kontrolle
            übernehmen wir keine Haftung für die Inhalte externer, verlinkter
            Seiten. Für deren Inhalte sind ausschließlich deren Betreiber
            verantwortlich.
          </p>
        </div>
      </section>
    </div>
  );
}

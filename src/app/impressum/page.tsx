import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Impressum</h1>

      <section className="mt-8 space-y-6 text-white/80">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Angaben gemäß § 5 DDG
          </h2>
          <p className="mt-2">
            Thomas Werning
            <br />
            Am Floßgraben 2
            <br />
            37276 Meinhard
            <br />
            Deutschland
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">Kontakt</h2>
          <p className="mt-2">
            E-Mail: info@o4p.de
            <br />
            Telefon: 0174 9776596
            <br />
            Fax: 05651 338938
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
          </h2>
          <p className="mt-2">
            Thomas Werning
            <br />
            Am Floßgraben 2
            <br />
            37276 Meinhard
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

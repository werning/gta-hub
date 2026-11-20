import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-white">Datenschutzerklärung</h1>

      <section className="mt-8 space-y-6 text-white/80">
        <div>
          <h2 className="text-lg font-semibold text-white">
            1. Verantwortlicher
          </h2>
          <p className="mt-2">
            Thomas Werning
            <br />
            Am Floßgraben 2
            <br />
            37276 Meinhard
            <br />
            E-Mail: info@o4p.de
            <br />
            Telefon: 0174 9776596
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            2. Hosting und Server-Logfiles
          </h2>
          <p className="mt-2">
            Diese Seite wird bei Vercel Inc., 340 S Lemon Ave #4133, Walnut,
            CA 91789, USA gehostet. Beim Aufruf der Seite verarbeitet der
            Hosting-Anbieter automatisch technische Daten (u. a.
            IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite,
            verwendeter Browser) in sogenannten Server-Logfiles. Diese
            Verarbeitung ist zum sicheren und stabilen Betrieb der Seite
            erforderlich (Art. 6 Abs. 1 lit. f DSGVO) und wird von Vercel
            automatisch nach kurzer Zeit (im verwendeten kostenlosen Tarif
            nach wenigen Stunden) gelöscht. Da Vercel seinen Sitz in den
            USA hat, erfolgt die Datenübermittlung auf Grundlage der von
            Vercel abgeschlossenen EU-Standardvertragsklauseln.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            3. Cookies und Tracking
          </h2>
          <p className="mt-2">
            Für Besucher:innen der Seite werden aktuell keine Cookies
            gesetzt und keine Analyse- oder Tracking-Tools eingesetzt. Ein
            technisch notwendiges Login-Cookie existiert ausschließlich für
            den internen Redaktionsbereich und betrifft keine normalen
            Besucher:innen.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            4. Kontaktaufnahme
          </h2>
          <p className="mt-2">
            Wenn du uns per E-Mail kontaktierst, verarbeiten wir die von dir
            mitgeteilten Daten (u. a. E-Mail-Adresse, Inhalt der Nachricht)
            ausschließlich zur Bearbeitung deiner Anfrage (Art. 6 Abs. 1
            lit. b bzw. f DSGVO) und löschen sie, sobald sie nicht mehr
            benötigt werden.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            5. Deine Rechte
          </h2>
          <p className="mt-2">
            Du hast das Recht auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit und
            Widerspruch gegen die Verarbeitung deiner personenbezogenen
            Daten. Wende dich dazu an die oben genannte Kontaktadresse.
            Außerdem hast du das Recht, dich bei einer
            Datenschutz-Aufsichtsbehörde zu beschweren.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-white">
            6. Änderungen
          </h2>
          <p className="mt-2">
            Diese Datenschutzerklärung wird angepasst, sobald neue Funktionen
            hinzukommen (z. B. ein Bezahl-Abo, Nutzerkonten oder
            Statistik-Tools).
          </p>
        </div>
      </section>
    </div>
  );
}

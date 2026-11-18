import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch-Phase",
  description:
    "Leonida Living ist aktuell für alle komplett kostenlos – hilf mit, die Community aufzubauen.",
};

const benefits = [
  "Alle News, Hacks & Tricks, Tipps und Missionsanleitungen",
  "Keine Anmeldung, keine Zahlungsdaten nötig",
  "Direktes Feedback hilft uns, die Seite zu verbessern",
];

export default function PremiumPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <h1 className="text-3xl font-bold text-white sm:text-4xl">
        Aktuell für alle kostenlos
      </h1>
      <p className="mt-3 text-white/60">
        Wir bauen gerade die Community rund um Leonida Living auf. Deshalb
        sind in der Launch-Phase alle Inhalte frei zugänglich – ganz ohne
        Abo.
      </p>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <p className="text-4xl font-bold text-white">
          0 €
          <span className="text-base font-medium text-white/50">
            {" "}
            für die ersten 30 Tage
          </span>
        </p>

        <ul className="mt-6 space-y-3 text-left text-sm text-white/70">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2">
              <span className="mt-0.5 text-[#17d6c9]">✓</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <p className="mt-8 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3 text-sm text-white/60">
          Danach ist ein kleines Premium-Abo (ca. 2,99 €/Monat) für einen
          Teil der Inhalte geplant, um den Betrieb der Seite zu finanzieren.
          Wann genau und wie, geben wir rechtzeitig bekannt.
        </p>
      </div>
    </div>
  );
}

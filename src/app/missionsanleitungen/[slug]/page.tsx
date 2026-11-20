import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug } from "@/lib/guides";

type Props = {
  params: Promise<{ slug: string }>;
};

// Kein generateStaticParams: solange es noch keine freigegebenen Einträge
// gibt (neues Content-Verzeichnis), würde Cache Components den Build
// ablehnen (siehe news/[slug]/page.tsx, das funktioniert, weil dort
// bereits mindestens ein Artikel existiert). Seite wird stattdessen pro
// Anfrage dynamisch gerendert.
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return { title: guide.title, description: guide.excerpt };
}

export default async function MissionsanleitungDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide || guide.status !== "published") {
    notFound();
  }

  const date = new Date(guide.publishedAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link
        href="/missionsanleitungen"
        className="text-sm text-white/50 hover:text-white"
      >
        ← Zurück zu Missionsanleitungen
      </Link>

      <span className="mt-6 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
        {guide.tag}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
        {guide.title}
      </h1>
      <p className="mt-3 text-sm text-white/40">{date}</p>

      <div className="mt-6 space-y-4 text-white/80">
        {guide.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
        Quelle:{" "}
        <a
          href={guide.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-[#8ff0e8] hover:underline"
        >
          {guide.sourceName}
        </a>
        . Dieser Beitrag ist eine Zusammenfassung in eigenen Worten, kein
        Originaltext der Quelle.
      </p>
    </article>
  );
}

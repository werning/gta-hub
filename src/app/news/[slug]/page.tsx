import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getPublishedArticles } from "@/lib/articles";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPublishedArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  const date = new Date(article.publishedAt).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link href="/news" className="text-sm text-white/50 hover:text-white">
        ← Zurück zu News
      </Link>

      <span className="mt-6 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
        {article.tag}
      </span>
      <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
        {article.title}
      </h1>
      <p className="mt-3 text-sm text-white/40">{date}</p>

      <div className="mt-6 space-y-4 text-white/80">
        {article.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <p className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
        Quelle:{" "}
        <a
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="text-[#8ff0e8] hover:underline"
        >
          {article.sourceName}
        </a>
        . Dieser Artikel ist eine eigene Zusammenfassung in eigenen Worten,
        kein Originaltext.
      </p>
    </article>
  );
}

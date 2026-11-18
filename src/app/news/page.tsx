import type { Metadata } from "next";
import { ContentCard } from "@/components/ContentCard";
import { PlaceholderNotice } from "@/components/PlaceholderNotice";
import { getPublishedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "News",
  description: "Täglich frische GTA 6 News, in eigenen Worten zusammengefasst.",
};

export default function NewsPage() {
  const articles = getPublishedArticles();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">News</h1>
        <p className="mt-3 max-w-2xl text-white/60">
          Jeden Tag fassen wir seriöse Quellen zu GTA 6 in eigenen Worten
          zusammen – mit Link zur Originalquelle am Ende jedes Artikels.
        </p>
      </header>

      {articles.length === 0 ? (
        <PlaceholderNotice>
          Noch keine freigegebenen Artikel. Der tägliche News-Workflow legt
          Entwürfe an, die zuerst unter{" "}
          <code className="text-white/80">/admin/news</code> freigegeben
          werden müssen.
        </PlaceholderNotice>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ContentCard
              key={article.slug}
              href={`/news/${article.slug}`}
              tag={article.tag}
              title={article.title}
              excerpt={article.excerpt}
              meta={`Quelle: ${article.sourceName}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

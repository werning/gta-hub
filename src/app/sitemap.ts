import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/lib/articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const STATIC_PATHS = [
  "",
  "/news",
  "/hacks-und-tricks",
  "/tipps",
  "/missionsanleitungen",
  "/karte",
  "/premium",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
  }));

  const articleEntries = getPublishedArticles().map((a) => ({
    url: `${SITE_URL}/news/${a.slug}`,
    lastModified: new Date(a.publishedAt),
  }));

  return [...staticEntries, ...articleEntries];
}

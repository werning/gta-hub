import { readFileSync, readdirSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import {
  githubContentConfigured,
  githubDeleteFile,
  githubPutFile,
} from "./github-content";

const CONTENT_DIR = path.join(process.cwd(), "content", "news");
const CONTENT_REPO_DIR = "content/news";

export type ArticleStatus = "draft" | "published";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  tag: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  fetchedAt: string;
  status: ArticleStatus;
};

function articlePath(slug: string) {
  return path.join(CONTENT_DIR, `${slug}.json`);
}

function readAllArticles(): Article[] {
  let files: string[] = [];
  try {
    files = readdirSync(CONTENT_DIR).filter(
      (f) => f.endsWith(".json") && !f.startsWith("_")
    );
  } catch {
    return [];
  }

  return files
    .map(
      (f) => JSON.parse(readFileSync(path.join(CONTENT_DIR, f), "utf-8")) as Article
    )
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getAllArticles(): Article[] {
  return readAllArticles();
}

export function getPublishedArticles(): Article[] {
  return readAllArticles().filter((a) => a.status === "published");
}

export function getDraftArticles(): Article[] {
  return readAllArticles().filter((a) => a.status === "draft");
}

export function getArticleBySlug(slug: string): Article | undefined {
  return readAllArticles().find((a) => a.slug === slug);
}

export function getKnownSourceUrls(): Set<string> {
  return new Set(readAllArticles().map((a) => a.sourceUrl));
}

export async function saveArticle(article: Article) {
  const json = JSON.stringify(article, null, 2);
  if (githubContentConfigured()) {
    await githubPutFile(
      `${CONTENT_REPO_DIR}/${article.slug}.json`,
      json,
      `news: Entwurf "${article.title}"`
    );
  } else {
    writeFileSync(articlePath(article.slug), json);
  }
}

export async function setArticleStatus(slug: string, status: ArticleStatus) {
  const article = getArticleBySlug(slug);
  if (!article) return;
  article.status = status;
  const json = JSON.stringify(article, null, 2);
  if (githubContentConfigured()) {
    await githubPutFile(
      `${CONTENT_REPO_DIR}/${slug}.json`,
      json,
      `news: "${article.title}" -> ${status}`
    );
  } else {
    writeFileSync(articlePath(slug), json);
  }
}

export async function deleteArticle(slug: string) {
  if (githubContentConfigured()) {
    await githubDeleteFile(`${CONTENT_REPO_DIR}/${slug}.json`, `news: ${slug} entfernt`);
    return;
  }
  try {
    unlinkSync(articlePath(slug));
  } catch {
    // already gone
  }
}

// Täglicher News-Workflow: liest RSS-Feeds, filtert auf GTA 6, schreibt
// Entwürfe (eigene Zusammenfassung + Quelle) nach content/news/*.json.
//
// Aufruf:
//   node scripts/fetch-news.mjs            echte Artikel-Entwürfe erzeugen
//   node scripts/fetch-news.mjs --dry-run   nur zeigen, was gefunden würde
//
// Braucht ANTHROPIC_API_KEY in der Umgebung (siehe .env.local.example).

import { readFileSync, readdirSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { XMLParser } from "fast-xml-parser";
import Anthropic from "@anthropic-ai/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "news");
const FEEDS_FILE = path.join(CONTENT_DIR, "_feeds.json");

const DRY_RUN = process.argv.includes("--dry-run");
const MAX_NEW_ARTICLES_PER_RUN = 5;
const KEYWORDS = ["gta 6", "gta vi", "grand theft auto 6", "grand theft auto vi"];
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: "__cdata" });

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function stripHtml(html) {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function loadExistingSourceUrls() {
  if (!existsSync(CONTENT_DIR)) return new Set();
  const files = readdirSync(CONTENT_DIR).filter(
    (f) => f.endsWith(".json") && !f.startsWith("_")
  );
  const urls = new Set();
  for (const f of files) {
    try {
      const data = JSON.parse(readFileSync(path.join(CONTENT_DIR, f), "utf-8"));
      if (data.sourceUrl) urls.add(data.sourceUrl);
    } catch {
      // ignore malformed file
    }
  }
  return urls;
}

function loadExistingSlugs() {
  if (!existsSync(CONTENT_DIR)) return new Set();
  return new Set(
    readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
      .map((f) => f.replace(/\.json$/, ""))
  );
}

async function fetchFeedItems(feed) {
  const res = await fetch(feed.url, {
    headers: { "User-Agent": "LeonidaLivingBot/1.0 (+news aggregator)" },
  });
  if (!res.ok) {
    console.warn(`  ⚠ ${feed.name}: HTTP ${res.status}`);
    return [];
  }
  const xml = await res.text();
  const data = parser.parse(xml);
  const rawItems = data?.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items
    .filter(Boolean)
    .map((item) => {
      const title = typeof item.title === "object" ? item.title.__cdata : item.title;
      const rawDescription =
        typeof item.description === "object"
          ? item.description.__cdata
          : item.description;
      return {
        sourceName: feed.name,
        title: title ? decodeEntities(title) : "",
        link: item.link ?? "",
        description: stripHtml(rawDescription ?? ""),
        pubDate: item.pubDate ?? new Date().toISOString(),
      };
    })
    .filter((item) => item.title && item.link);
}

function matchesKeywords(item) {
  const haystack = `${item.title} ${item.description}`.toLowerCase();
  return KEYWORDS.some((kw) => haystack.includes(kw));
}

async function rewriteWithClaude(anthropic, item) {
  const sourceExcerpt = item.description.slice(0, 1800);

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system:
      "Du bist Redakteur bei 'Leonida Living', einer deutschsprachigen, " +
      "inoffiziellen GTA-6-Fan-Community-Seite. Du bekommst einen " +
      "Ausschnitt eines englischsprachigen Gaming-News-Artikels. Fasse " +
      "ausschließlich die darin enthaltenen Fakten auf Deutsch in eigenen, " +
      "neuen Worten zusammen. Erfinde nichts, das nicht im Text steht. " +
      "Kopiere keine Sätze wörtlich. Schreibe sachlich und für Fans " +
      "verständlich. Halte dich kurz: maximal 3 Absätze mit je maximal " +
      "3 Sätzen. Antworte NUR mit kompaktem, vollständigem JSON ohne " +
      "Markdown-Codeblock, mit genau diesen Feldern: " +
      '{"title": "eigener deutscher Titel, keine Wort-für-Wort-Übersetzung", ' +
      '"excerpt": "ein Satz Zusammenfassung", ' +
      '"paragraphs": ["Absatz 1", "Absatz 2", "Absatz 3"], ' +
      '"tag": "eine von Release, Gameplay, Setting, Patch, Sonstiges"}',
    messages: [
      {
        role: "user",
        content: `Originaltitel: ${item.title}\n\nAusschnitt:\n${sourceExcerpt}`,
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim()
    .replace(/^```(json)?/i, "")
    .replace(/```$/, "")
    .trim();

  return JSON.parse(text);
}

async function main() {
  const feeds = JSON.parse(readFileSync(FEEDS_FILE, "utf-8"));
  const knownUrls = loadExistingSourceUrls();
  const knownSlugs = loadExistingSlugs();

  console.log(`Lese ${feeds.length} RSS-Feed(s) …`);
  const allItems = (await Promise.all(feeds.map(fetchFeedItems))).flat();
  const relevant = allItems.filter(matchesKeywords);
  const candidates = relevant.filter((item) => !knownUrls.has(item.link));

  console.log(
    `${allItems.length} Einträge gelesen, ${relevant.length} zu GTA 6, ` +
      `${candidates.length} davon neu.`
  );

  const toProcess = candidates.slice(0, MAX_NEW_ARTICLES_PER_RUN);

  if (DRY_RUN) {
    console.log("\n--dry-run: es würde Folgendes verarbeitet:");
    for (const item of toProcess) {
      console.log(`  [${item.sourceName}] ${item.title}\n    ${item.link}`);
    }
    return;
  }

  if (toProcess.length === 0) {
    console.log("Keine neuen Artikel.");
    return;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "✗ ANTHROPIC_API_KEY fehlt. In .env.local eintragen (siehe .env.local.example)."
    );
    process.exitCode = 1;
    return;
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let created = 0;

  for (const item of toProcess) {
    try {
      const rewritten = await rewriteWithClaude(anthropic, item);

      let slug = slugify(rewritten.title || item.title);
      if (!slug) slug = slugify(item.title) || `artikel-${Date.now()}`;
      let candidate = slug;
      let i = 2;
      while (knownSlugs.has(candidate)) {
        candidate = `${slug}-${i++}`;
      }
      slug = candidate;
      knownSlugs.add(slug);

      const article = {
        slug,
        title: rewritten.title,
        excerpt: rewritten.excerpt,
        paragraphs: rewritten.paragraphs,
        tag: rewritten.tag || "Sonstiges",
        sourceName: item.sourceName,
        sourceUrl: item.link,
        publishedAt: new Date(item.pubDate).toISOString(),
        fetchedAt: new Date().toISOString(),
        status: "draft",
      };

      writeFileSync(
        path.join(CONTENT_DIR, `${slug}.json`),
        JSON.stringify(article, null, 2)
      );
      created++;
      console.log(`  ✓ Entwurf erstellt: ${slug}`);
    } catch (err) {
      console.warn(`  ⚠ Übersprungen (${item.title}): ${err.message}`);
    }
  }

  console.log(`\nFertig. ${created} neue Entwürfe in content/news/.`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

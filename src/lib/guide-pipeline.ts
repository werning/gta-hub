// Produktions-Variante des Missionsanleitungen-Workflows (für die
// Vercel-Cron-Route). Gleiche Logik wie scripts/fetch-guides.mjs, aber als
// TypeScript-Modul, damit es über src/lib/guides.ts speichert (lokal =
// Dateisystem, online = Commit über die GitHub-API).
//
// Wichtig: GTA 6 ist noch nicht erschienen, es gibt also keine echten
// Missions-Walkthroughs. Der Prompt verlangt deshalb ausdrücklich eine
// Vorschau dessen, was aus seriösen Quellen zu Missionen/Story bekannt ist
// – keine erfundenen Schritt-für-Schritt-Anleitungen.

import { readFileSync } from "fs";
import path from "path";
import { XMLParser } from "fast-xml-parser";
import Anthropic from "@anthropic-ai/sdk";
import { getAllGuides, saveGuide, type Guide } from "./guides";

const FEEDS_FILE = path.join(process.cwd(), "content", "missionsanleitungen", "_feeds.json");
const MAX_NEW_GUIDES_PER_RUN = 5;
const GTA_KEYWORDS = ["gta 6", "gta vi", "grand theft auto 6", "grand theft auto vi"];
const MISSION_KEYWORDS = [
  "mission",
  "heist",
  "story",
  "campaign",
  "quest",
  "protagonist",
  "characters",
  "jason",
  "lucia",
  "walkthrough",
];
const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-5-5";

type Feed = { name: string; url: string };
type FeedItem = {
  sourceName: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: "__cdata" });

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function fetchFeedItems(feed: Feed): Promise<FeedItem[]> {
  const res = await fetch(feed.url, {
    headers: { "User-Agent": "LeonidaLivingBot/1.0 (+guides aggregator)" },
  });
  if (!res.ok) return [];
  const xml = await res.text();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = parser.parse(xml);
  const rawItems = data?.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];

  return items
    .filter(Boolean)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((item: any): FeedItem => {
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
    .filter((item: FeedItem) => item.title && item.link);
}

function matchesKeywords(item: FeedItem): boolean {
  const haystack = `${item.title} ${item.description}`.toLowerCase();
  const isGta6 = GTA_KEYWORDS.some((kw) => haystack.includes(kw));
  const isMission = MISSION_KEYWORDS.some((kw) => haystack.includes(kw));
  return isGta6 && isMission;
}

async function rewriteWithClaude(anthropic: Anthropic, item: FeedItem) {
  const sourceExcerpt = item.description.slice(0, 1800);

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system:
      "Du bist Redakteur bei 'Leonida Living', einer deutschsprachigen, " +
      "inoffiziellen GTA-6-Fan-Community-Seite, im Bereich " +
      "'Missionsanleitungen'. GTA 6 ist noch NICHT erschienen – es gibt " +
      "also keine echten Spieldurchläufe. Du bekommst einen Ausschnitt " +
      "eines englischsprachigen Gaming-News-Artikels mit Infos zu " +
      "Missionen, Story oder Charakteren. Fasse ausschließlich die darin " +
      "enthaltenen Fakten auf Deutsch in eigenen, neuen Worten als " +
      "VORSCHAU zusammen – niemals als fertige Schritt-für-Schritt-" +
      "Anleitung, da das Gameplay noch nicht bekannt ist. Erfinde keine " +
      "Missionsschritte, Spielmechaniken oder Details, die nicht im Text " +
      "stehen. Kopiere keine Sätze wörtlich. Schreibe sachlich und für " +
      "Fans verständlich. Halte dich kurz: maximal 3 Absätze mit je " +
      "maximal 3 Sätzen. Antworte NUR mit kompaktem, vollständigem JSON " +
      "ohne Markdown-Codeblock, mit genau diesen Feldern: " +
      '{"title": "eigener deutscher Titel, der klar als Vorschau/Preview ' +
      'erkennbar ist, keine Wort-für-Wort-Übersetzung", ' +
      '"excerpt": "ein Satz Zusammenfassung", ' +
      '"paragraphs": ["Absatz 1", "Absatz 2", "Absatz 3"], ' +
      '"tag": "eine von Hauptmission, Nebenmission, Gameplay, Sonstiges"}',
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

  return JSON.parse(text) as {
    title: string;
    excerpt: string;
    paragraphs: string[];
    tag: string;
  };
}

export type GuidePipelineResult = {
  created: number;
  skipped: number;
  log: string[];
};

export async function runGuidePipeline(): Promise<GuidePipelineResult> {
  const log: string[] = [];
  const feeds: Feed[] = JSON.parse(readFileSync(FEEDS_FILE, "utf-8"));
  const existing = getAllGuides();
  const knownUrls = new Set(existing.map((g) => g.sourceUrl));
  const knownSlugs = new Set(existing.map((g) => g.slug));

  const allItems = (await Promise.all(feeds.map(fetchFeedItems))).flat();
  const relevant = allItems.filter(matchesKeywords);
  const candidates = relevant.filter((item) => !knownUrls.has(item.link));
  const toProcess = candidates.slice(0, MAX_NEW_GUIDES_PER_RUN);

  log.push(
    `${allItems.length} Einträge gelesen, ${relevant.length} zu Missionen/Story, ${candidates.length} neu.`
  );

  if (toProcess.length === 0) {
    return { created: 0, skipped: 0, log };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    log.push("ANTHROPIC_API_KEY fehlt – keine Entwürfe erzeugt.");
    return { created: 0, skipped: toProcess.length, log };
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  let created = 0;
  let skipped = 0;

  for (const item of toProcess) {
    try {
      const rewritten = await rewriteWithClaude(anthropic, item);

      let slug = slugify(rewritten.title || item.title) || `guide-${Date.now()}`;
      let candidate = slug;
      let i = 2;
      while (knownSlugs.has(candidate)) candidate = `${slug}-${i++}`;
      slug = candidate;
      knownSlugs.add(slug);

      const guide: Guide = {
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

      await saveGuide(guide);
      created++;
      log.push(`Entwurf erstellt: ${slug}`);
    } catch (err) {
      skipped++;
      log.push(`Übersprungen (${item.title}): ${(err as Error).message}`);
    }
  }

  return { created, skipped, log };
}

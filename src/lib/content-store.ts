// Generische Basis für Content-Typen, die als einzelne JSON-Dateien in
// einem Unterordner von content/ liegen (z. B. News, Missionsanleitungen):
// Lesen/Sortieren, Entwurf/Freigabe-Status, Speichern/Löschen. Lokal wird
// direkt auf die Festplatte geschrieben, online über die GitHub-API
// (siehe github-content.ts), weil Vercel zur Laufzeit nicht dauerhaft
// schreibbar ist.

import { readFileSync, readdirSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import {
  githubContentConfigured,
  githubDeleteFile,
  githubGetFile,
  githubListJsonFiles,
  githubPutFile,
} from "./github-content";

export type ContentStatus = "draft" | "published";

export type ContentItem = {
  slug: string;
  title: string;
  excerpt: string;
  paragraphs: string[];
  tag: string;
  sourceName: string;
  sourceUrl: string;
  publishedAt: string;
  fetchedAt: string;
  status: ContentStatus;
};

export function createContentStore<T extends ContentItem>(
  folderName: string,
  commitPrefix: string
) {
  const CONTENT_DIR = path.join(process.cwd(), "content", folderName);
  const CONTENT_REPO_DIR = `content/${folderName}`;

  function itemPath(slug: string) {
    return path.join(CONTENT_DIR, `${slug}.json`);
  }

  function readAll(): T[] {
    let files: string[] = [];
    try {
      files = readdirSync(CONTENT_DIR).filter(
        (f) => f.endsWith(".json") && !f.startsWith("_")
      );
    } catch {
      return [];
    }

    return files
      .map((f) => JSON.parse(readFileSync(path.join(CONTENT_DIR, f), "utf-8")) as T)
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }

  function getAll(): T[] {
    return readAll();
  }

  function getPublished(): T[] {
    return readAll().filter((item) => item.status === "published");
  }

  function getDrafts(): T[] {
    return readAll().filter((item) => item.status === "draft");
  }

  // Für die Admin-Freigabeseiten: liest live über die GitHub-API statt aus
  // dem lokalen Dateisystem. Grund: Online schreibt `save`/`setStatus`
  // direkt ins GitHub-Repo, aber die laufende Vercel-Funktion hat weiterhin
  // den alten Datei-Stand im eigenen Bundle (der ändert sich erst mit dem
  // nächsten Deployment, das der Commit automatisch auslöst – das dauert
  // 15-30 Sekunden). `readAll()`/`getDrafts()` zeigen in dieser Zeit also
  // fälschlich noch den alten Stand, obwohl Freigeben/Verwerfen schon
  // durchgelaufen ist – das sah für Admins wie ein Button aus, der erst
  // nach mehreren Klicks reagiert. `getDraftsLive()` umgeht das, indem es
  // den aktuellen Verzeichnisinhalt direkt von GitHub holt.
  //
  // Wichtig: Jede Datei wird über githubGetFile() (api.github.com) gelesen,
  // NICHT über den download_url-Link aus der Verzeichnis-Auflistung. Der
  // download_url zeigt auf raw.githubusercontent.com, das GitHub über ein
  // eigenes CDN mit mehreren Minuten Verzögerung ausliefert – frisch
  // freigegebene Einträge blieben darüber bis zu einigen Minuten als
  // Entwurf sichtbar, obwohl der Commit längst durch war. api.github.com
  // liefert dagegen immer den aktuellen Stand.
  async function getDraftsLive(): Promise<T[]> {
    if (!githubContentConfigured()) {
      return getDrafts();
    }
    const files = await githubListJsonFiles(CONTENT_REPO_DIR);
    const items = await Promise.all(
      files.map((f) => githubGetFile(`${CONTENT_REPO_DIR}/${f.name}`))
    );
    return items
      .filter((json): json is string => Boolean(json))
      .map((json) => JSON.parse(json) as T)
      .filter((item) => item.status === "draft")
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  }

  function getBySlug(slug: string): T | undefined {
    return readAll().find((item) => item.slug === slug);
  }

  function getKnownSourceUrls(): Set<string> {
    return new Set(readAll().map((item) => item.sourceUrl));
  }

  async function save(item: T) {
    const json = JSON.stringify(item, null, 2);
    if (githubContentConfigured()) {
      await githubPutFile(
        `${CONTENT_REPO_DIR}/${item.slug}.json`,
        json,
        `${commitPrefix}: Entwurf "${item.title}"`
      );
    } else {
      writeFileSync(itemPath(item.slug), json);
    }
  }

  // Liest den aktuellen Stand des Eintrags live von GitHub statt aus dem
  // lokalen Bundle, bevor der Status geändert wird – siehe getDraftsLive()
  // oben. Ohne das schlug "Freigeben" fehl (stiller No-op), sobald ein
  // Entwurf neuer war als das laufende Deployment: getBySlug() fand die
  // Datei lokal nicht, setStatus brach wegen `if (!item) return;` ab, ohne
  // dass auf GitHub etwas geändert wurde. Für Admins sah das aus wie ein
  // Button, der erst nach mehreren Klicks reagiert.
  async function getBySlugLive(slug: string): Promise<T | undefined> {
    if (!githubContentConfigured()) {
      return getBySlug(slug);
    }
    const json = await githubGetFile(`${CONTENT_REPO_DIR}/${slug}.json`);
    return json ? (JSON.parse(json) as T) : undefined;
  }

  async function setStatus(slug: string, status: ContentStatus) {
    const item = await getBySlugLive(slug);
    if (!item) return;
    item.status = status;
    const json = JSON.stringify(item, null, 2);
    if (githubContentConfigured()) {
      await githubPutFile(
        `${CONTENT_REPO_DIR}/${slug}.json`,
        json,
        `${commitPrefix}: "${item.title}" -> ${status}`
      );
    } else {
      writeFileSync(itemPath(slug), json);
    }
  }

  async function remove(slug: string) {
    if (githubContentConfigured()) {
      await githubDeleteFile(
        `${CONTENT_REPO_DIR}/${slug}.json`,
        `${commitPrefix}: ${slug} entfernt`
      );
      return;
    }
    try {
      unlinkSync(itemPath(slug));
    } catch {
      // already gone
    }
  }

  return {
    getAll,
    getPublished,
    getDrafts,
    getDraftsLive,
    getBySlug,
    getKnownSourceUrls,
    save,
    setStatus,
    remove,
  };
}

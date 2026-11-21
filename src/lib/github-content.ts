// Schreibt/löscht Dateien im eigenen GitHub-Repo über die GitHub-API.
// Genutzt in Produktion (Vercel), wo das Dateisystem zur Laufzeit nicht
// dauerhaft beschreibbar ist. Lokal in der Entwicklung wird stattdessen
// direkt auf die Festplatte geschrieben (siehe src/lib/articles.ts).

const GITHUB_API = "https://api.github.com";

export function githubContentConfigured(): boolean {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO);
}

async function githubRequest(path: string, init?: RequestInit) {
  // "cache: no-store" ist Pflicht: Next.js' erweitertes fetch() cacht GET-
  // Requests sonst standardmäßig (Data Cache). Ohne das lasen getFileSha/
  // githubListJsonFiles/githubGetFile teils veraltete Stände – u. a. die
  // sha aus getFileSha, wodurch der nachfolgende PUT/DELETE mit "falscher"
  // sha gegen den inzwischen aktuellen GitHub-Stand lief.
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`GitHub API ${res.status} bei ${path}: ${await res.text()}`);
  }
  return res;
}

async function getFileSha(repoPath: string, branch: string): Promise<string | undefined> {
  const repo = process.env.GITHUB_REPO;
  const res = await githubRequest(
    `/repos/${repo}/contents/${repoPath}?ref=${branch}`
  );
  if (res.status === 404) return undefined;
  const data = await res.json();
  return data.sha as string;
}

export async function githubPutFile(
  repoPath: string,
  content: string,
  message: string
) {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const sha = await getFileSha(repoPath, branch);

  await githubRequest(`/repos/${repo}/contents/${repoPath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });
}

// Nur Dateinamen, keine Inhalte: Die Verzeichnis-Auflistung der Contents-
// API liefert zwar auch einen download_url je Datei, der zeigt aber auf
// raw.githubusercontent.com, das GitHub über ein eigenes CDN mit
// mehrminütiger Verzögerung ausliefert. Den tatsächlichen Inhalt daher
// separat über githubGetFile() (api.github.com, immer aktuell) laden.
export async function githubListJsonFiles(repoDir: string): Promise<{ name: string }[]> {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const res = await githubRequest(`/repos/${repo}/contents/${repoDir}?ref=${branch}`);
  if (res.status === 404) return [];
  const data = (await res.json()) as { name: string }[];
  return data.filter((f) => f.name.endsWith(".json") && !f.name.startsWith("_"));
}

// Liest eine einzelne Datei live über die Contents-API (inkl. base64-
// dekodiertem Inhalt in einem Request). Für setStatus/approve genutzt,
// damit auch Entwürfe freigegeben werden können, die erst nach dem
// aktuell laufenden Deployment per Cron/API committet wurden und daher
// noch nicht im lokalen Datei-Bundle dieser Funktion stecken.
export async function githubGetFile(repoPath: string): Promise<string | undefined> {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  const res = await githubRequest(`/repos/${repo}/contents/${repoPath}?ref=${branch}`);
  if (res.status === 404) return undefined;
  const data = await res.json();
  return Buffer.from(data.content, "base64").toString("utf-8");
}

export async function githubDeleteFile(repoPath: string, message: string) {
  const branch = process.env.GITHUB_BRANCH || "main";
  const sha = await getFileSha(repoPath, branch);
  if (!sha) return; // schon weg

  const repo = process.env.GITHUB_REPO;
  await githubRequest(`/repos/${repo}/contents/${repoPath}`, {
    method: "DELETE",
    body: JSON.stringify({ message, sha, branch }),
  });
}

# Leonida Living – Projektdokumentation

GTA-6-Community-Hub. Inoffizielle Fan-Seite, **nicht** verbunden mit Rockstar
Games oder Take-Two Interactive. Keine Rockstar-Logos, -Bilder oder -Videos –
nur eigene Texte und eigene Grafiken.

**Live:** https://www.leonida-living.de (eigene Domain, siehe Abschnitt 5
unten; https://gta-hub-psi.vercel.app funktioniert weiterhin und zeigt
denselben Inhalt)
**GitHub:** https://github.com/werning/gta-hub
**Vercel-Projekt:** https://vercel.com/werning/gta-hub
**Admin-Login:** https://www.leonida-living.de/admin/login (Passwort: siehe
Vercel-Umgebungsvariable `ADMIN_PASSWORD`, wurde dir im Chat mitgeteilt –
am besten zeitnah selbst ändern)

## Eckdaten (vom Nutzer festgelegt)

- **Name:** Leonida Living
- **Zielgruppe:** alle GTA-Fans allgemein
- **Premium-Preis:** 2,99 €/Monat (später – siehe Launch-Phase)
- **Launch-Phase:** erste 30 Tage komplett kostenlos für alle, kein Stripe,
  um zuerst eine Community aufzubauen. Bezahlfunktion wird erst danach
  eingebaut.
- **Freigabe neuer Artikel:** manuell (kein Auto-Publish) – Artikel landen als
  Entwurf, der Betreiber gibt sie frei

## Tech-Stack

| Bereich | Wahl |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript, Cache Components aktiv) |
| Styling | Tailwind CSS v4 |
| Hosting (geplant) | Vercel (Free-Tier, inkl. Cron-Jobs) |
| Datenbank/Nutzer (geplant) | Supabase (Free-Tier) |
| Zahlungen (geplant) | Stripe Checkout + Webhook |
| News-Pipeline (geplant) | RSS-Feeds seriöser Gaming-News-Seiten + Claude API zum Umschreiben in eigenen Worten mit Quellenangabe |

### Wichtig: Cache Components (Next.js 16)

`next.config.ts` hat `cacheComponents: true`. Das heißt: Datenzugriffe sind
**standardmäßig dynamisch**; alles, was statisch im Build vorgerendert werden
soll, braucht entweder keine Request-Zeit-APIs (`cookies()`, `headers()`,
`new Date()` etc.) oder muss explizit mit der `"use cache"`-Direktive
versehen werden. Beispiel: `src/components/Footer.tsx` nutzt `"use cache"`,
weil dort `new Date().getFullYear()` steht. Die `/admin/*`-Seiten lesen
`cookies()` und sind deshalb bewusst mit `export const instant = false`
markiert (dynamisch, kein Pre-Rendering – richtig so für einen
Login-Bereich). Bei weiteren dynamischen Bereichen vorher
`node_modules/next/dist/docs/01-app/02-guides/authentication-with-cache-components.md`
lesen – das Next.js in diesem Projekt (v16.4.6) weicht an der Stelle von
älteren Next.js-Versionen ab.

## Projektstruktur

```
src/
  app/
    layout.tsx              Root-Layout (Header + Footer, Metadata)
    page.tsx                 Startseite
    news/page.tsx
    hacks-und-tricks/page.tsx
    tipps/page.tsx
    missionsanleitungen/page.tsx   alle vier: Vorschau-/Einschätzungsinhalte (Details unten)
    karte/page.tsx
    premium/page.tsx          "Launch-Phase"-Seite (aktuell kostenlos)
    impressum/page.tsx        Platzhalter (echter Inhalt in Schritt 4)
    datenschutz/page.tsx      Platzhalter (echter Inhalt in Schritt 4)
    news/[slug]/page.tsx       Detailseite je Content-Typ (ebenso für
    missionsanleitungen/[slug]/page.tsx   hacks-und-tricks und tipps)
    hacks-und-tricks/[slug]/page.tsx
    tipps/[slug]/page.tsx
    api/cron/fetch-{news,guides,hacks,tipps}/route.ts   je ein Vercel-Cron-Endpunkt
    admin/
      page.tsx                 Redirect je nach Login-Status
      login/page.tsx            Passwort-Login
      news/page.tsx             Entwürfe freigeben/verwerfen (ebenso
      missionsanleitungen/page.tsx   missionsanleitungen/, hacks-und-tricks/
      hacks-und-tricks/page.tsx       und tipps/ – gleicher Aufbau, eigene
      tipps/page.tsx                  Daten)
      actions.ts                 Server Actions (login, logout, approve/reject je Typ)
  components/
    Header.tsx                Client Component, mobiles Menü
    Footer.tsx
    Logo.tsx                  eigenes SVG-Logo
    ContentCard.tsx            wiederverwendbare Vorschau-Karte (mit Premium-Badge)
    PlaceholderNotice.tsx      Hinweisbanner für Platzhalterinhalte
    AdminNav.tsx               Wechsel-Navigation zwischen den vier Admin-Freigabeseiten
  lib/
    nav.ts                     Navigationspunkte, Site-Name
    site.ts                    Preis-/Launch-Konstanten
    content-store.ts            generische Basis: lesen/schreiben/Status je Content-Ordner
    articles.ts / guides.ts / hacks.ts / tipps.ts   je Content-Typ, über content-store.ts
    news-pipeline.ts / guide-pipeline.ts / hacks-pipeline.ts / tipps-pipeline.ts
                                 Produktions-Workflow je Typ (für die Cron-Routen)
    github-content.ts           Commit/Delete von Content-Dateien über die GitHub-API (online)
    admin-auth.ts                Passwort-Session-Check für /admin
content/
  news/                        _feeds.json + <slug>.json (draft oder published)
  missionsanleitungen/         dito
  hacks-und-tricks/            dito
  tipps/                       dito
scripts/
  fetch-{news,guides,hacks,tipps}.mjs   je ein lokaler täglicher Workflow (siehe unten)
```

## Lokal starten

```bash
npm --prefix Projects/leonida-living run dev
```

Läuft auf http://localhost:3000. In diesem Chat-Fenster wird der Server über
die Vorschau-Funktion gestartet (Konfiguration in
`C:\Users\ThomasWerning\Documents\claude\.claude\launch.json`).

## Status

- [x] **Schritt 1 – Grundgerüst:** Seitenstruktur, Navigation, mobiles Design,
      eigenes Logo. Alle Seiten sind aktuell Platzhalterinhalte.
- [x] **Entscheidung – Launch-Phase statt Stripe:** Alle Inhalte sind für die
      ersten 30 Tage komplett kostenlos, um zuerst eine Community
      aufzubauen. `/premium` erklärt das, Stripe/Bezahlschranke kommt erst
      später (eigener Schritt, wenn gewünscht).
- [x] **Schritt 3 – Täglicher News-Workflow:** RSS-Feeds einlesen, mit
      Claude API in eigenen Worten umschreiben (mit Quellenangabe), als
      Entwurf speichern, Freigabe-Oberfläche unter `/admin/news`. Lokal
      getestet und funktionsfähig, inkl. einem echten Beispielartikel.
- [x] **Schritt 4 – Online stellen:** Seite ist live unter
      https://www.leonida-living.de, Code auf GitHub, alle sechs
      Umgebungsvariablen in Vercel gesetzt, Cron-Job aktiv (News läuft
      täglich 5:00 Uhr UTC). Offen: Impressum/Datenschutz enthalten noch
      Platzhalter – echte Angaben (Name, Adresse, E-Mail) selbst eintragen,
      bevor der Link breit geteilt wird. Eigene Domain ist seit 20.11.2026
      eingerichtet, siehe Abschnitt 5 unten.
- [x] **Schritt 5 – Missionsanleitungen, Hacks & Tricks, Tipps:** alle drei
      nach demselben Prinzip wie der News-Workflow (RSS → Claude API →
      Entwurf → Freigabe unter `/admin/<bereich>`), aber jeweils mit
      eigenen Schlagwörtern gefiltert und mit eigenem Prompt, der die
      Inhalte klar als **Vorschau/Einschätzung** formuliert statt als
      fertige Anleitung/getesteten Trick – GTA 6 ist noch nicht
      erschienen. Eigene Cron-Jobs, alle zwischen 5 und 6 Uhr UTC gestaffelt
      (Missionsanleitungen 5:15, Hacks & Tricks 5:30, Tipps 5:45 Uhr UTC,
      siehe `vercel.json`) – so sind morgens bis 7 Uhr alle vier Bereiche
      für die Freigabe bereit. Details siehe eigener Abschnitt unten.

## Schritt 4 – Online stellen (Schritt für Schritt)

**Kostenlos nötig:** ein GitHub-Account und ein Vercel-Account (Anmeldung
bei Vercel direkt mit dem GitHub-Account möglich, kein separates Passwort
nötig). Beide Anmeldungen musst du selbst machen – das kann ich nicht für
dich übernehmen.

### 1. GitHub-Repository anlegen
1. Auf https://github.com/new ein neues, **leeres** Repository anlegen
   (kein README, keine .gitignore auswählen – ist hier schon vorhanden).
   Name z. B. `leonida-living`. Privat oder öffentlich ist beides möglich,
   für den Anfang spricht nichts gegen privat.
2. Die angezeigte Repository-URL (z. B.
   `https://github.com/<dein-name>/leonida-living.git`) kopieren.

### 2. Code hochladen
Im Projektordner (`Projects/leonida-living`, hat bereits ein lokales
Git-Repo):

```bash
git add -A
git commit -m "Erste Version von Leonida Living"
git branch -M main
git remote add origin https://github.com/<dein-name>/leonida-living.git
git push -u origin main
```

### 3. Vercel-Projekt erstellen
1. Auf https://vercel.com mit GitHub anmelden.
2. "Add New" → "Project" → das `leonida-living`-Repository auswählen und
   importieren. Vercel erkennt Next.js automatisch, keine Einstellungen
   nötig.
3. **Vor dem ersten Deploy** unter "Environment Variables" eintragen:
   - `ANTHROPIC_API_KEY` – dein Key von console.anthropic.com
   - `ADMIN_PASSWORD` – eigenes, sicheres Passwort für `/admin/news`
   - `GITHUB_TOKEN` – siehe Schritt 4 unten
   - `GITHUB_REPO` – z. B. `<dein-name>/leonida-living`
   - `GITHUB_BRANCH` – `main`
   - `CRON_SECRET` – eine beliebige lange Zufallszeichenfolge
   - `NEXT_PUBLIC_SITE_URL` – zunächst die von Vercel vergebene Adresse,
     z. B. `https://leonida-living.vercel.app`
4. "Deploy" klicken. Nach 1–2 Minuten ist die Seite live unter einer
   kostenlosen `*.vercel.app`-Adresse.

### 4. GitHub-Token für den täglichen Workflow erstellen
Damit der tägliche Cron-Job und die Freigabe in `/admin/news` auf der
Live-Seite Artikel speichern können (siehe Erklärung oben bei Schritt 3):
1. https://github.com/settings/personal-access-tokens/new öffnen.
2. "Repository access" → "Only select repositories" → `leonida-living`
   auswählen.
3. Unter "Permissions" → "Contents" → **Read and write** setzen. Sonst
   nichts.
4. Token erzeugen, in Vercel als `GITHUB_TOKEN` eintragen (siehe oben) und
   danach ein Redeploy auslösen (Vercel → Deployments → "Redeploy").

### 5. Eigene Domain (erledigt, 20.11.2026)
`leonida-living.de` wurde bei INWX registriert (5,97 € im 1. Jahr, danach
4,65 €/Jahr) und ist mit dem Vercel-Projekt verbunden:

- In Vercel unter **Settings → Domains** eingetragen: `leonida-living.de`
  (leitet mit 308 auf `www` weiter) und `www.leonida-living.de`
  (Production). Beide zeigen "Valid Configuration", SSL läuft automatisch
  über Vercel.
- DNS bei INWX (Nameserver-Verwaltung der Domain) gesetzt:
  `A @ → 216.198.79.1` und `CNAME www → 59e9c7063c7b2587.vercel-dns-017.com.`
  (die von Vercel vorgegebenen Werte – falls die Domain mal neu
  verbunden werden muss, zeigt Vercel unter Domains → "View DNS
  configuration" die jeweils aktuellen Werte).
- `NEXT_PUBLIC_SITE_URL` in den Vercel-Umgebungsvariablen auf
  `https://www.leonida-living.de` geändert und redeployed – `sitemap.xml`,
  `robots.txt` und alle Metadaten (siehe [src/app/layout.tsx](src/app/layout.tsx))
  nutzen jetzt automatisch die neue Domain.
- Die alte Adresse `https://gta-hub-psi.vercel.app` bleibt als
  Vercel-Domain bestehen und zeigt denselben Inhalt (kein Redirect
  eingerichtet, falls irgendwo schon verlinkt).

**Falls eine weitere Domain (z. B. `leonidaliving.de` ohne Bindestrich)
dazukommen soll:** gleiches Vorgehen – bei INWX kaufen, in Vercel unter
Domains hinzufügen, die angezeigten DNS-Werte bei INWX eintragen, fertig.

### 6. Rechtliches nicht vergessen
Vor dem Teilen des Links öffentlich: in `/impressum` und `/datenschutz`
alle `[Platzhalter in eckigen Klammern]` durch echte Angaben ersetzen
(siehe Hinweisbox jeweils oben auf der Seite).

### 7. Bei Suchmaschinen anmelden (für Traffic)

`robots.txt` und `sitemap.xml` sind bereits vorhanden und werden von
Next.js automatisch erzeugt. Fehlt nur noch die Anmeldung bei den
Suchmaschinen-Tools selbst:

**Google Search Console** (https://search.google.com/search-console):
1. Mit Google-Account anmelden, "Property hinzufügen" → "URL-Präfix" →
   die Live-Adresse eintragen (z. B. `https://gta-hub-psi.vercel.app`
   oder die eigene Domain, sobald eingerichtet).
2. Verifizierungsmethode **"HTML-Tag"** wählen, den angezeigten Code
   (nur der Wert aus `content="..."`) kopieren.
3. In Vercel als Umgebungsvariable `GOOGLE_SITE_VERIFICATION` eintragen,
   redeployen, dann bei Google auf "Verifizieren" klicken.
4. Unter "Sitemaps" (linkes Menü) `sitemap.xml` eintragen und senden.

**Wichtig seit Umstieg auf die eigene Domain (20.11.2026):** Die bisherige
`GOOGLE_SITE_VERIFICATION` war für die `gta-hub-psi.vercel.app`-Property
eingerichtet. Eine URL-Präfix-Property gilt nur für genau diese Adresse –
für `https://www.leonida-living.de` muss daher eine **neue Property**
angelegt werden (am besten gleich als **Domain-Property** für
`leonida-living.de`, dann sind http/https/www/non-www automatisch
abgedeckt; Verifizierung läuft dabei über einen TXT-Eintrag bei INWX statt
über das HTML-Tag). Noch nicht gemacht – steht als nächster Schritt an.

**Bing Webmaster Tools** (https://www.bing.com/webmasters):
1. Mit Microsoft-Account anmelden.
2. Einfachster Weg: "Von Google Search Console importieren" – übernimmt
   Verifizierung und Sitemap automatisch, falls Google schon eingerichtet
   ist.
3. Alternativ manuell: Property hinzufügen, Verifizierungsmethode
   "Meta-Tag", Code als `BING_SITE_VERIFICATION` in Vercel eintragen,
   redeployen, verifizieren, Sitemap `sitemap.xml` einreichen.

**Danach:** Indexierung dauert meist einige Tage bis Wochen. Über die
URL-Prüfung in der Search Console lässt sich die Startseite und einzelne
Artikel manuell zur Indexierung anmelden, was es oft beschleunigt.
Echter Traffic kommt zusätzlich über Zeit, gute Inhalte und – optional –
Verlinkung aus Communities/Foren.

## Schritt 3 – Täglicher News-Workflow (Details)

**Wie es funktioniert:**
1. `scripts/fetch-news.mjs` liest die RSS-Feeds aus `content/news/_feeds.json`
   (aktuell 12 Quellen: GameSpot, PC Gamer, Eurogamer, Rock Paper Shotgun,
   IGN, PCGamesN, VG247, Dexerto, Polygon sowie die deutschen Seiten
   PCGames.de, GamePro.de und 4Players.de). Eigene Quellen lassen sich
   jederzeit ergänzen, indem man `{ "name": ..., "url": ... }` mit einer
   gültigen RSS/Atom-Feed-URL in die Datei einträgt (für alle vier Bereiche
   separat, da jeder sein eigenes `_feeds.json` hat). Die Rockstar-Games-
   Newswire selbst bietet keinen öffentlichen RSS-Feed und kann deshalb
   nicht automatisch eingebunden werden.
2. Einträge werden auf GTA-6-Bezug gefiltert und mit bereits vorhandenen
   Artikeln abgeglichen (keine Duplikate).
3. Pro Lauf werden maximal 10 neue Artikel verarbeitet (Kostenschutz,
   zugleich Obergrenze für Vercels 60-Sekunden-Zeitlimit auf dem
   Free-Tier – bei vielen Treffern an einem Tag kann es daher auch mal
   weniger als 10 werden; der Rest folgt dann im nächsten Lauf).
4. Jeder Artikel wird über die Claude API (Modell `claude-haiku-5-5`) in
   eigenen deutschen Worten zusammengefasst – strikte Anweisung: nichts
   erfinden, nichts wörtlich kopieren, Quelle bleibt immer verlinkt.
5. Ergebnis landet als `content/news/<slug>.json` mit `"status": "draft"`.
6. Unter `/admin/news` (passwortgeschützt, `ADMIN_PASSWORD`) werden Entwürfe
   geprüft und per Klick freigegeben oder verworfen. Erst nach Freigabe
   erscheint ein Artikel auf `/news`.

**Lokal ausführen:**

```bash
# erst ohne Claude-API testen (zeigt nur, was gefunden würde):
npm --prefix Projects/leonida-living run news:fetch:dry

# echte Entwürfe erzeugen (braucht ANTHROPIC_API_KEY in .env.local):
npm --prefix Projects/leonida-living run news:fetch
```

**Noch offen – echte Automatisierung (Teil von Schritt 4):**
Aktuell muss der Befehl manuell gestartet werden. Für einen wirklich
*täglichen* Ablauf ohne eigenes Zutun gibt es zwei Optionen, die wir in
Schritt 4 zusammen mit dem Hosting entscheiden:
- **Windows-Aufgabenplanung** auf diesem Rechner (einfach, aber nur aktiv,
  wenn der PC läuft).
- **Cloud-Automatisierung** (z. B. GitHub Actions oder Vercel Cron Jobs),
  sobald die Seite online ist – läuft unabhängig vom eigenen Rechner.

**Benötigte Umgebungsvariablen** (siehe `.env.local.example`):
- `ANTHROPIC_API_KEY` – eigener Key von https://console.anthropic.com/settings/keys
- `ADMIN_PASSWORD` – frei wählbares Passwort für `/admin/news`

Für lokale Tests wurde in `.env.local` bereits ein zufälliges
`ADMIN_PASSWORD` eingetragen (nicht committet). `ANTHROPIC_API_KEY` muss
noch ergänzt werden, bevor `npm run news:fetch` (ohne `:dry`) echte Artikel
erzeugt.

## Schritt 5 – Missionsanleitungen, Hacks & Tricks, Tipps (Details)

**Warum Vorschauen/Einschätzungen statt fertiger Inhalte:** GTA 6 ist noch
nicht erschienen, es gibt also weder echte Missions-Walkthroughs noch
getestete Hacks. Statt etwas zu erfinden, fassen diese drei Workflows
zusammen, was seriöse Quellen bereits verraten haben – klar als
Vorschau/Einschätzung gekennzeichnet. Sobald das Spiel da ist, kann daraus
(manuell oder mit einem neuen Prompt) echter Anleitungs-Content werden.

**Wie es funktioniert:** identisch zum News-Workflow (siehe oben,
RSS → Claude API → Entwurf → Freigabe), aber jeder Bereich hat eigene
Schlagwörter, einen eigenen Prompt (der explizit nichts erfinden darf,
was nicht in der Quelle steht) und eigene Tags:

| Bereich | Lib/Pipeline | Zusätzliche Schlagwörter | Tags | Admin | Cron (UTC) |
|---|---|---|---|---|---|
| Missionsanleitungen | `guides.ts` / `guide-pipeline.ts` | mission, heist, story, protagonist, jason, lucia, … | Hauptmission, Nebenmission, Gameplay, Sonstiges | `/admin/missionsanleitungen` | 5:15 Uhr |
| Hacks & Tricks | `hacks.ts` / `hacks-pipeline.ts` | gameplay, map, economy, weapon, vehicle, cover, … | Bewegung, Wirtschaft, Kampf, Sonstiges | `/admin/hacks-und-tricks` | 5:30 Uhr |
| Tipps | `tipps.ts` / `tipps-pipeline.ts` | platform, pre-order, price, requirements, beginner, … | Technik, Vorbestellung, Einsteiger, Sonstiges | `/admin/tipps` | 5:45 Uhr |

Jeder Treffer muss zusätzlich eines der GTA-6-Schlagwörter aus dem
News-Workflow enthalten (UND-Verknüpfung) – nicht jeder GTA-6-Artikel
landet also in jedem Bereich.

**Lokal ausführen** (analog für `guides`, `hacks`, `tipps`):

```bash
npm --prefix Projects/leonida-living run guides:fetch:dry
npm --prefix Projects/leonida-living run hacks:fetch:dry
npm --prefix Projects/leonida-living run tipps:fetch:dry
# ohne :dry für echte Entwürfe (braucht ANTHROPIC_API_KEY)
```

**Cron:** je ein eigener Vercel-Cron-Job (siehe Tabelle oben und
`vercel.json`), alle viertelstündlich gestaffelt zwischen 5:00 und
6:00 Uhr UTC (News 5:00, Missionsanleitungen 5:15, Hacks & Tricks 5:30,
Tipps 5:45), damit nicht alle vier gleichzeitig laufen und morgens beim
Frühstück (z. B. 7 Uhr) bereits alle vier Entwürfe zur Freigabe bereit
stehen – nutzt dieselben Umgebungsvariablen wie News (`ANTHROPIC_API_KEY`,
`CRON_SECRET`, `GITHUB_TOKEN`/`GITHUB_REPO`/`GITHUB_BRANCH`).

## Täglicher Start

Sobald die Seite online ist (siehe Schritt 4), laufen alle vier Workflows
von selbst (je einmal täglich per Vercel Cron, siehe Zeiten oben). Dein
täglicher Ablauf:

1. **Entwürfe freigeben:** `/admin/news`, `/admin/missionsanleitungen`,
   `/admin/hacks-und-tricks` und `/admin/tipps` auf deiner Domain öffnen
   (alle mit demselben `ADMIN_PASSWORD`, oben an jeder Seite kann zwischen
   allen vier Bereichen gewechselt werden), neue Entwürfe lesen und mit
   "Freigeben" oder "Verwerfen" entscheiden. Das ist der einzige
   wiederkehrende Handgriff.
2. **Gelegentlich reinschauen:** `/news`, `/missionsanleitungen`,
   `/hacks-und-tricks` und `/tipps` auf der Live-Seite, ob alles wie
   gewünscht aussieht.
3. **Bei Bedarf weiterentwickeln:** einfach in diesem Chat weitermachen,
   z. B. "füge eine echte Mission hinzu" oder "jetzt Stripe einbauen".

**Lokal weiterarbeiten** (z. B. um Design-Änderungen zu testen, bevor sie
live gehen):

```bash
npm --prefix Projects/leonida-living run dev
```

Läuft dann unter http://localhost:3000. Änderungen, die du per `git push`
hochlädst, deployt Vercel automatisch neu.

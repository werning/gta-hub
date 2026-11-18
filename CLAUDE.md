# Leonida Living – Projektdokumentation

GTA-6-Community-Hub. Inoffizielle Fan-Seite, **nicht** verbunden mit Rockstar
Games oder Take-Two Interactive. Keine Rockstar-Logos, -Bilder oder -Videos –
nur eigene Texte und eigene Grafiken.

**Live:** https://gta-hub-psi.vercel.app
**GitHub:** https://github.com/werning/gta-hub
**Vercel-Projekt:** https://vercel.com/werning/gta-hub
**Admin-Login:** https://gta-hub-psi.vercel.app/admin/login (Passwort: siehe
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
    missionsanleitungen/page.tsx   zeigt Vorschau/Paywall-Muster
    karte/page.tsx
    premium/page.tsx          "Launch-Phase"-Seite (aktuell kostenlos)
    impressum/page.tsx        Platzhalter (echter Inhalt in Schritt 4)
    datenschutz/page.tsx      Platzhalter (echter Inhalt in Schritt 4)
    news/[slug]/page.tsx       Artikel-Detailseite
    admin/
      page.tsx                 Redirect je nach Login-Status
      login/page.tsx            Passwort-Login
      news/page.tsx             Entwürfe freigeben/verwerfen
      actions.ts                 Server Actions (login, logout, approve, reject)
  components/
    Header.tsx                Client Component, mobiles Menü
    Footer.tsx
    Logo.tsx                  eigenes SVG-Logo
    ContentCard.tsx            wiederverwendbare Vorschau-Karte (mit Premium-Badge)
    PlaceholderNotice.tsx      Hinweisbanner für Platzhalterinhalte
  lib/
    nav.ts                     Navigationspunkte, Site-Name
    site.ts                    Preis-/Launch-Konstanten
    articles.ts                 Lesen/Schreiben von content/news/*.json
    admin-auth.ts                Passwort-Session-Check für /admin
content/
  news/
    _feeds.json                 Liste der RSS-Quellen
    <slug>.json                  ein Artikel (draft oder published)
scripts/
  fetch-news.mjs                 täglicher News-Workflow (siehe unten)
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
      https://gta-hub-psi.vercel.app, Code auf GitHub, alle sechs
      Umgebungsvariablen in Vercel gesetzt, Cron-Job aktiv (läuft ab morgen
      täglich automatisch). Offen: Impressum/Datenschutz enthalten noch
      Platzhalter – echte Angaben (Name, Adresse, E-Mail) selbst eintragen,
      bevor der Link breit geteilt wird. Eigene Domain optional, siehe
      Abschnitt 5 unten.

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

### 5. Eigene Domain (optional, nicht kostenlos)
Die `*.vercel.app`-Adresse ist dauerhaft kostenlos. Eine eigene Domain
(z. B. `leonida-living.de`) kostet bei einem Registrar meist 10–15 €/Jahr.
Das Hosting selbst bleibt Vercel (Cron-Job, Freigabe-Workflow etc.
funktionieren nur dort wie eingerichtet) – es wird nur die Adresse
ausgetauscht.

1. **Domain kaufen** bei einem Registrar, z. B. IONOS, Namecheap, INWX
   oder Porkbun. Empfehlenswert: `.de` für eine deutsche Zielgruppe, oder
   eine themenpassende `.com`/`.gg`.
2. In Vercel: Projekt **gta-hub** → **Settings** → **Domains** → Domain
   eingeben → "Add". Vercel zeigt dir die nötigen DNS-Einträge an
   (meist ein **A-Eintrag** für die nackte Domain und ein **CNAME** für
   `www`, Ziel jeweils von Vercel vorgegeben).
3. Diese Einträge beim Registrar in der DNS-Verwaltung eintragen (Name
   und Wert exakt wie von Vercel angezeigt übernehmen).
4. Warten, bis Vercel die Domain als "Valid Configuration" anzeigt
   (DNS-Ausbreitung dauert meist Minuten bis wenige Stunden). SSL-Zertifikat
   wird automatisch und kostenlos eingerichtet.
5. `NEXT_PUBLIC_SITE_URL` in den Vercel-Umgebungsvariablen auf die neue
   Domain ändern (z. B. `https://leonida-living.de`) und einmal
   redeployen.
6. Optional: die alte `*.vercel.app`-Adresse in Vercel unter Domains auf
   "Redirect to" die neue Domain stellen, damit alte Links weiterhin
   funktionieren.

### 6. Rechtliches nicht vergessen
Vor dem Teilen des Links öffentlich: in `/impressum` und `/datenschutz`
alle `[Platzhalter in eckigen Klammern]` durch echte Angaben ersetzen
(siehe Hinweisbox jeweils oben auf der Seite).

## Schritt 3 – Täglicher News-Workflow (Details)

**Wie es funktioniert:**
1. `scripts/fetch-news.mjs` liest die RSS-Feeds aus `content/news/_feeds.json`
   (aktuell: GameSpot, PC Gamer, Eurogamer, Rock Paper Shotgun).
2. Einträge werden auf GTA-6-Bezug gefiltert und mit bereits vorhandenen
   Artikeln abgeglichen (keine Duplikate).
3. Pro Lauf werden maximal 5 neue Artikel verarbeitet (Kostenschutz).
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

## Täglicher Start

Sobald die Seite online ist (siehe Schritt 4), läuft der News-Workflow von
selbst (einmal täglich per Vercel Cron). Dein täglicher Ablauf:

1. **Artikel freigeben:** `https://<deine-domain>/admin/news` öffnen, mit
   deinem `ADMIN_PASSWORD` einloggen, neue Entwürfe lesen und mit
   "Freigeben" oder "Verwerfen" entscheiden. Das ist der einzige
   wiederkehrende Handgriff.
2. **Gelegentlich reinschauen:** `/news` auf der Live-Seite, ob alles wie
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

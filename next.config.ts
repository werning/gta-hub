import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    // Der Admin-Bereich wurde trotz `instant = false` von Vercels Edge
    // gecacht ("instant = false" schaltet nur die Instant-Navigation-
    // Validierung ab, erzwingt laut Next.js-Doku aber KEIN permanentes
    // Deaktivieren von Caching – die Route "nutzt weiterhin Prerendering
    // und Streaming"). Dadurch sah eine frisch freigegebene Änderung
    // teils minutenlang nicht aktualisiert aus. Hier wird das Caching für
    // /admin/* explizit auf HTTP-Ebene abgeschaltet.
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

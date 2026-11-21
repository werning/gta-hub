import type { LeonidaRegion } from "@/lib/regions";

// Eigene, stilisierte Illustration des Bundesstaats Leonida – keine
// Spielgrafik und keine originalgetreue Küstenlinie, sondern eine frei
// gezeichnete, an Floridas reale (gemeinfreie) Geografie angelehnte Form.
// Die sechs Zonen sind grob an der von Rockstar/der Presse beschriebenen
// Lage zueinander ausgerichtet (siehe content der Karten-Seite), nicht an
// exakten Koordinaten. Jede Region ist klickbar und springt zur
// zugehörigen Beschreibung weiter unten auf der Seite.

const PINS: Record<string, { x: number; y: number; labelY: number }> = {
  "mount-kalaga": { x: 190, y: 85, labelY: 62 },
  "port-gellhorn": { x: 115, y: 190, labelY: 167 },
  ambrosia: { x: 230, y: 215, labelY: 238 },
  grassrivers: { x: 195, y: 330, labelY: 353 },
  "vice-city": { x: 290, y: 290, labelY: 313 },
  "leonida-keys": { x: 222, y: 452, labelY: 475 },
};

function labelWidth(text: string) {
  return text.length * 7 + 20;
}

export function LeonidaMap({ regions }: { regions: LeonidaRegion[] }) {
  return (
    <svg
      viewBox="0 0 400 560"
      className="h-auto w-full max-w-md mx-auto"
      role="img"
      aria-label="Stilisierte Übersichtskarte der sechs Regionen Leonidas"
    >
      <style>{`
        .ll-pin { cursor: pointer; transition: transform 0.15s ease; transform-box: fill-box; transform-origin: center; }
        .ll-pin:hover { transform: scale(1.12); }
      `}</style>
      <defs>
        <linearGradient id="ll-water" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d5c6b" />
          <stop offset="100%" stopColor="#0b0414" />
        </linearGradient>
        <linearGradient id="ll-land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241433" />
          <stop offset="100%" stopColor="#1a0e26" />
        </linearGradient>
      </defs>

      <rect width="400" height="560" fill="url(#ll-water)" />

      {/* dezente Wellenlinien im Wasser */}
      <g stroke="#8ff0e8" strokeOpacity="0.12" fill="none" strokeWidth="1.5">
        <path d="M20,60 q15,-8 30,0 t30,0" />
        <path d="M330,120 q15,-8 30,0" />
        <path d="M15,420 q15,-8 30,0 t30,0" />
        <path d="M310,480 q15,-8 30,0 t30,0" />
      </g>

      {/* Landmasse */}
      <path
        d="M110,40 C150,15 220,15 260,35 C290,55 285,100 305,140 C325,180 335,230 325,275
           C318,310 300,340 280,375 C260,410 245,440 230,470 C220,485 205,480 198,465
           C180,430 165,400 145,370 C120,335 100,295 92,250 C82,195 85,145 95,100
           C100,75 100,55 110,40 Z"
        fill="url(#ll-land)"
        stroke="#f5f0f8"
        strokeOpacity="0.15"
      />

      {/* Zonen-Einfärbung je Region, dezent über der Landmasse */}
      <ellipse cx={190} cy={85} rx={75} ry={55} fill={regions.find((r) => r.slug === "mount-kalaga")?.color} opacity={0.28} />
      <ellipse cx={115} cy={190} rx={55} ry={75} fill={regions.find((r) => r.slug === "port-gellhorn")?.color} opacity={0.28} />
      <ellipse cx={230} cy={215} rx={55} ry={50} fill={regions.find((r) => r.slug === "ambrosia")?.color} opacity={0.3} />
      <ellipse cx={195} cy={330} rx={70} ry={75} fill={regions.find((r) => r.slug === "grassrivers")?.color} opacity={0.3} />
      <ellipse cx={290} cy={290} rx={45} ry={55} fill={regions.find((r) => r.slug === "vice-city")?.color} opacity={0.32} />
      <ellipse cx={222} cy={452} rx={30} ry={25} fill={regions.find((r) => r.slug === "leonida-keys")?.color} opacity={0.32} />

      {/* Leonida Keys – Inselkette */}
      <g fill={regions.find((r) => r.slug === "leonida-keys")?.color} opacity={0.5}>
        <circle cx={248} cy={476} r={9} />
        <circle cx={267} cy={492} r={6.5} />
        <circle cx={284} cy={504} r={5} />
        <circle cx={299} cy={514} r={3.5} />
      </g>

      <text x="200" y="26" textAnchor="middle" fill="#f5f0f8" fontSize="15" fontWeight="700" letterSpacing="3">
        LEONIDA
      </text>

      {/* Kompassrose unten links */}
      <g transform="translate(36,520)" stroke="#f5f0f8" strokeOpacity="0.5" fill="none">
        <circle r="16" strokeWidth="1" />
        <path d="M0,-16 V16 M-16,0 H16" strokeWidth="1" />
        <text y="-20" textAnchor="middle" fill="#f5f0f8" fillOpacity="0.6" fontSize="10" stroke="none">
          N
        </text>
      </g>

      {regions.map((region) => {
        const pin = PINS[region.slug];
        if (!pin) return null;
        const w = labelWidth(region.name);
        return (
          <a key={region.slug} href={`#${region.slug}`} aria-label={region.name}>
            <g className="ll-pin">
              <rect
                x={pin.x - w / 2}
                y={pin.labelY - 14}
                width={w}
                height={20}
                rx={10}
                fill="#0b0414"
                fillOpacity="0.72"
              />
              <text
                x={pin.x}
                y={pin.labelY}
                textAnchor="middle"
                fill="#f5f0f8"
                fontSize="12"
                fontWeight="600"
              >
                {region.name}
              </text>
              <circle cx={pin.x} cy={pin.y} r={7} fill={region.color} stroke="#f5f0f8" strokeWidth="1.5" />
            </g>
          </a>
        );
      })}
    </svg>
  );
}

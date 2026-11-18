import Link from "next/link";
import { Logo } from "./Logo";
import { NAV_ITEMS, SITE_NAME, SITE_TAGLINE } from "@/lib/nav";

export async function Footer() {
  "use cache";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0b0414]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="font-semibold text-white">{SITE_NAME}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-white/60">{SITE_TAGLINE}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Seiten</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Rechtliches</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            <li>
              <Link href="/impressum" className="hover:text-white">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:text-white">
                Datenschutzerklärung
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/40 sm:px-6">
        <p>
          © {year} {SITE_NAME}. Inoffizielle Fan-Community-Seite, nicht
          verbunden mit oder autorisiert durch Rockstar Games, Take-Two
          Interactive oder deren Marken.
        </p>
      </div>
    </footer>
  );
}

export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Startseite" },
  { href: "/news", label: "News" },
  { href: "/hacks-und-tricks", label: "Hacks & Tricks" },
  { href: "/tipps", label: "Tipps" },
  { href: "/missionsanleitungen", label: "Missionsanleitungen" },
  { href: "/karte", label: "Karte" },
];

export const SITE_NAME = "Leonida Living";
export const SITE_TAGLINE = "Die Community-Seite rund um GTA 6";

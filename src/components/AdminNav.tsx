import Link from "next/link";

const ADMIN_SECTIONS = [
  { href: "/admin/news", label: "News" },
  { href: "/admin/missionsanleitungen", label: "Missionsanleitungen" },
  { href: "/admin/hacks-und-tricks", label: "Hacks & Tricks" },
  { href: "/admin/tipps", label: "Tipps" },
];

export function AdminNav({ current }: { current: string }) {
  return (
    <nav className="mb-6 flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {ADMIN_SECTIONS.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          className={
            section.href === current
              ? "font-semibold text-white"
              : "text-white/50 hover:text-white"
          }
        >
          {section.label}
        </Link>
      ))}
    </nav>
  );
}

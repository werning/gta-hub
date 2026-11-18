import Link from "next/link";

export type ContentCardProps = {
  href: string;
  tag: string;
  title: string;
  excerpt: string;
  meta?: string;
  premium?: boolean;
};

export function ContentCard({
  href,
  tag,
  title,
  excerpt,
  meta,
  premium,
}: ContentCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
          {tag}
        </span>
        {premium && (
          <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#ff2e88]/20 to-[#6c1bd6]/20 px-3 py-1 text-xs font-semibold text-[#ff8fc0]">
            🔒 Premium
          </span>
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-[#ff8fc0]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{excerpt}</p>
      {meta && <p className="mt-4 text-xs text-white/40">{meta}</p>}
    </Link>
  );
}

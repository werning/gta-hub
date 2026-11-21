import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDraftArticlesLive } from "@/lib/articles";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { approveArticle, logout, rejectArticle } from "../actions";
import { ApprovalButtons } from "@/components/ApprovalButtons";
import { AdminNav } from "@/components/AdminNav";

export const metadata: Metadata = {
  title: "Artikel freigeben",
  robots: { index: false, follow: false },
};

// Liest cookies() -> immer dynamisch, bewusst kein "instant"-UI nötig.
export const instant = false;

export default async function AdminNewsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const drafts = await getDraftArticlesLive();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <AdminNav current="/admin/news" />
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Artikel freigeben</h1>
          <p className="mt-2 text-white/60">
            {drafts.length === 0
              ? "Aktuell keine offenen Entwürfe."
              : `${drafts.length} Entwurf/Entwürfe warten auf Freigabe.`}
          </p>
        </div>
        <form action={logout}>
          <button className="cursor-pointer text-sm text-white/50 hover:text-white">
            Abmelden
          </button>
        </form>
      </div>

      <div className="space-y-6">
        {drafts.map((article) => (
          <article
            key={article.slug}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
              {article.tag}
            </span>
            <h2 className="mt-3 text-xl font-bold text-white">
              {article.title}
            </h2>
            <p className="mt-2 text-sm text-white/70">{article.excerpt}</p>

            <div className="mt-4 space-y-3 text-sm text-white/60">
              {article.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <p className="mt-4 text-xs text-white/40">
              Quelle:{" "}
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="underline"
              >
                {article.sourceName}
              </a>
            </p>

            <ApprovalButtons
              onApprove={approveArticle.bind(null, article.slug)}
              onReject={rejectArticle.bind(null, article.slug)}
            />
          </article>
        ))}
      </div>
    </div>
  );
}

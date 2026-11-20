import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDraftTippsLive } from "@/lib/tipps";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { approveTipp, logout, rejectTipp } from "../actions";
import { SubmitButton } from "@/components/SubmitButton";
import { AdminNav } from "@/components/AdminNav";

export const metadata: Metadata = {
  title: "Tipps freigeben",
  robots: { index: false, follow: false },
};

// Liest cookies() -> immer dynamisch, bewusst kein "instant"-UI nötig.
export const instant = false;

export default async function AdminTippsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const drafts = await getDraftTippsLive();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <AdminNav current="/admin/tipps" />
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tipps freigeben</h1>
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
        {drafts.map((tipp) => (
          <article
            key={tipp.slug}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70">
              {tipp.tag}
            </span>
            <h2 className="mt-3 text-xl font-bold text-white">
              {tipp.title}
            </h2>
            <p className="mt-2 text-sm text-white/70">{tipp.excerpt}</p>

            <div className="mt-4 space-y-3 text-sm text-white/60">
              {tipp.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <p className="mt-4 text-xs text-white/40">
              Quelle:{" "}
              <a
                href={tipp.sourceUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="underline"
              >
                {tipp.sourceName}
              </a>
            </p>

            <div className="mt-5 flex gap-3">
              <form action={approveTipp.bind(null, tipp.slug)}>
                <SubmitButton
                  pendingText="Wird freigegeben …"
                  className="rounded-full bg-gradient-to-r from-[#ff2e88] to-[#6c1bd6] px-5 py-2 text-sm font-semibold text-white transition-opacity"
                >
                  Freigeben
                </SubmitButton>
              </form>
              <form action={rejectTipp.bind(null, tipp.slug)}>
                <SubmitButton
                  pendingText="Wird verworfen …"
                  className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/70 transition-colors hover:bg-white/5"
                >
                  Verwerfen
                </SubmitButton>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

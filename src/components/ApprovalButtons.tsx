"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

// Ruft die Server Actions direkt auf (statt über <form action={...}>) und
// aktualisiert die Seite danach explizit per router.refresh(). Grund: die
// implizite Navigation, die Next.js nach einem Form-Action-Submit selbst
// auslöst, geriet im Admin-Bereich mit der Link-Prefetch-Aktivität der
// AdminNav in einen Konflikt – der Server Action-Request (den die GitHub-
// Schreibseite zuverlässig abschloss) wurde clientseitig per
// net::ERR_ABORTED gekappt, bevor die Seite das Ergebnis anzeigen konnte.
// Admins mussten dann mehrfach klicken, obwohl die erste Freigabe im
// Hintergrund längst durchgelaufen war.
export function ApprovalButtons({
  onApprove,
  onReject,
}: {
  onApprove: () => Promise<void>;
  onReject: () => Promise<void>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | null
  >(null);

  function handle(action: "approve" | "reject", fn: () => Promise<void>) {
    setPendingAction(action);
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div className="mt-5 flex gap-3">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handle("approve", onApprove)}
        className="cursor-pointer rounded-full bg-gradient-to-r from-[#ff2e88] to-[#6c1bd6] px-5 py-2 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && pendingAction === "approve"
          ? "Wird freigegeben …"
          : "Freigeben"}
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handle("reject", onReject)}
        className="cursor-pointer rounded-full border border-white/20 px-5 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && pendingAction === "reject"
          ? "Wird verworfen …"
          : "Verwerfen"}
      </button>
    </div>
  );
}

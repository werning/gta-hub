import type { ReactNode } from "react";

export function PlaceholderNotice({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto mb-10 max-w-6xl rounded-xl border border-dashed border-white/20 bg-white/[0.03] px-4 py-3 text-sm text-white/60 sm:px-6">
      {children}
    </div>
  );
}

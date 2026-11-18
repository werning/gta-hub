import type { Metadata } from "next";
import { login } from "../actions";

export const metadata: Metadata = {
  title: "Admin-Login",
  robots: { index: false, follow: false },
};

// Liest cookies() -> immer dynamisch, bewusst kein "instant"-UI nötig.
export const instant = false;

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-white">Admin-Login</h1>
      <p className="mt-2 text-sm text-white/60">
        Zugang zur Freigabe neuer News-Entwürfe.
      </p>

      <form action={login} className="mt-8 w-full space-y-3">
        <input
          type="password"
          name="password"
          placeholder="Passwort"
          required
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-[#ff2e88] focus:outline-none"
        />
        {error && (
          <p className="text-sm text-[#ff8fc0]">Falsches Passwort.</p>
        )}
        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-[#ff2e88] to-[#6c1bd6] px-5 py-3 text-sm font-semibold text-white"
        >
          Anmelden
        </button>
      </form>
    </div>
  );
}

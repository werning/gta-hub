"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { NAV_ITEMS, SITE_NAME } from "@/lib/nav";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0414]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-white"
          onClick={() => setOpen(false)}
        >
          <Logo className="h-8 w-8" />
          <span className="text-lg">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/premium"
            className="rounded-full bg-gradient-to-r from-[#ff2e88] to-[#6c1bd6] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#ff2e88]/20 transition-transform hover:scale-105"
          >
            Kostenlos dabei sein
          </Link>
        </div>

        <button
          type="button"
          aria-label="Menü öffnen"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 bg-white transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-6 bg-white transition-opacity ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-6 bg-white transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-[#0b0414] px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-base font-medium ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/80 hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2">
              <Link
                href="/premium"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-gradient-to-r from-[#ff2e88] to-[#6c1bd6] px-4 py-2.5 text-center text-base font-semibold text-white"
              >
                Kostenlos dabei sein
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

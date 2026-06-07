"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/marketing/content";

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav aria-label="Primary" className="flex items-center justify-between px-6 py-5 md:px-10">
        <button
          type="button"
          aria-expanded={open}
          aria-label="menu"
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
          className="font-bold tracking-tight text-ua-bg bg-ua-orange rounded-full px-5 py-2"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {open ? "close" : "menu"}
        </button>

        <Link
          href="/"
          className="text-ua-bg text-lg md:text-2xl font-bold italic tracking-tight"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          {SITE.name}
        </Link>

        <Link href="/login" className="text-ua-bg/90 hover:text-ua-bg font-semibold">
          log in
        </Link>
      </nav>

      {open && (
        <div id="nav-menu" className="mx-4 rounded-3xl bg-ua-ink/95 p-6 backdrop-blur">
          <ul className="flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-2xl font-bold text-ua-bg hover:text-ua-pink"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/syllabus", label: "Syllabus" },
  { href: "/pricing", label: "Pricing" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MarketingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--ua-ink)]/10"
      style={{ backgroundColor: "var(--ua-bg)" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-genty text-2xl leading-none tracking-tight select-none shrink-0"
          style={{ color: "var(--ua-blue)" }}
        >
          Urban AI
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-[var(--ua-blue)] hover:text-white"
              style={{ color: "var(--ua-ink)" }}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: Login + CTA */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-[var(--ua-ink)]/10"
            style={{ color: "var(--ua-ink)" }}
          >
            Log in
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
          >
            Start building →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-[var(--ua-ink)]/10"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="17" y2="6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                <line x1="3" y1="14" x2="17" y2="14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t border-[var(--ua-ink)]/10 px-4 py-4 flex flex-col gap-2"
          style={{ backgroundColor: "var(--ua-bg)" }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-[var(--ua-blue)] hover:text-white"
              style={{ color: "var(--ua-ink)" }}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t border-[var(--ua-ink)]/10 mt-1">
            <Link
              href="/login"
              className="flex-1 text-center px-4 py-2 rounded-full text-sm font-medium border border-[var(--ua-ink)]/20 transition-colors hover:bg-[var(--ua-ink)]/10"
              style={{ color: "var(--ua-ink)" }}
              onClick={() => setMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/pricing"
              className="flex-1 text-center inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
              onClick={() => setMenuOpen(false)}
            >
              Start building →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

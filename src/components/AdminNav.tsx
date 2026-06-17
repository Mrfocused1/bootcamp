"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/crm", label: "CRM" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/cohorts", label: "Cohorts" },
  { href: "/admin/recordings", label: "Recordings" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/broadcast", label: "Broadcast" },
];

export function AdminNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="flex flex-wrap gap-2 rounded-3xl border-2 border-ua-ink bg-white p-3 shadow-[6px_6px_0_var(--ua-ink)]"
      aria-label="Admin navigation"
      style={{ fontFamily: "var(--font-epilogue)" }}
    >
      {NAV_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${
            isActive(href)
              ? "bg-ua-ink text-ua-bg"
              : "text-ua-ink hover:bg-ua-ink/10"
          }`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}

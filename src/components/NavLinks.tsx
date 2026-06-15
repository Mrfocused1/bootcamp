"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/types";

interface NavLinksProps {
  role: Role;
}

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/schedule", label: "Schedule" },
  { href: "/book", label: "Book" },
];

export function NavLinks({ role }: NavLinksProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ fontFamily: "var(--font-epilogue)" }}
    >
      {LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold transition-colors sm:px-4 ${
            isActive(href)
              ? "bg-ua-ink text-ua-bg"
              : "text-ua-ink hover:bg-ua-ink/10"
          }`}
        >
          {label}
        </Link>
      ))}
      {role === "admin" && (
        <Link
          href="/admin"
          className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-bold transition-colors sm:px-4 ${
            pathname.startsWith("/admin")
              ? "bg-ua-orange text-ua-bg"
              : "bg-ua-pink text-ua-ink hover:bg-ua-orange hover:text-ua-bg"
          }`}
        >
          Admin
        </Link>
      )}
    </nav>
  );
}

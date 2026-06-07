"use client";

import Link from "next/link";
import type { Role } from "@/lib/types";

interface NavLinksProps {
  role: Role;
}

export function NavLinks({ role }: NavLinksProps) {
  return (
    <nav className="flex items-center gap-1">
      <Link
        href="/dashboard"
        className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-[var(--ua-blue)] hover:text-white"
      >
        Dashboard
      </Link>
      <Link
        href="/schedule"
        className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-[var(--ua-blue)] hover:text-white"
      >
        Schedule
      </Link>
      <Link
        href="/book"
        className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-[var(--ua-blue)] hover:text-white"
      >
        Book
      </Link>
      {role === "admin" && (
        <Link
          href="/admin"
          className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-[var(--ua-pink)] hover:bg-[var(--ua-orange)] hover:text-white"
        >
          Admin
        </Link>
      )}
    </nav>
  );
}

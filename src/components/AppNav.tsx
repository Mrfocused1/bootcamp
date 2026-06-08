import Link from "next/link";
import { getCurrentProfile } from "@/lib/queries";
import { NavLinks } from "@/components/NavLinks";

export async function AppNav() {
  const profile = await getCurrentProfile();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--ua-ink)]/10"
      style={{ backgroundColor: "var(--ua-bg)" }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="font-genty text-2xl leading-none tracking-tight select-none"
          style={{ color: "var(--ua-blue)" }}
        >
          Bridgeway AI
        </Link>

        {/* Centre nav */}
        <NavLinks role={profile.role} />

        {/* Right side */}
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-sm text-[var(--ua-ink)]/60 truncate max-w-[140px]">
            {profile.name}
          </span>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border border-[var(--ua-ink)]/20 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-[var(--ua-ink)] hover:text-[var(--ua-bg)]"
          >
            Sign out
          </Link>
        </div>
      </div>
    </header>
  );
}

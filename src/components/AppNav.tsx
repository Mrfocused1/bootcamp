import Link from "next/link";
import { getCurrentProfile } from "@/lib/queries";
import { NavLinks } from "@/components/NavLinks";
import { BrandLogo } from "@/components/marketing/BrandLogo";

export async function AppNav() {
  const profile = await getCurrentProfile();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b-2 border-ua-ink/10"
      style={{ backgroundColor: "var(--ua-bg)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Brand logo */}
        <Link href="/" aria-label="Bridgeway AI Bootcamp" className="shrink-0">
          <BrandLogo color="var(--ua-ink)" className="h-9 w-[42px] md:h-10 md:w-[46px]" />
        </Link>

        {/* Centre nav */}
        <NavLinks role={profile.role} />

        {/* Right side */}
        <div className="flex items-center gap-3">
          <span className="hidden max-w-[140px] truncate text-sm font-medium text-ua-ink/60 sm:block">
            {profile.name}
          </span>
          <Link
            href="/login"
            className="inline-flex items-center rounded-full border-2 border-ua-ink px-4 py-1.5 text-sm font-bold text-ua-ink transition-colors hover:bg-ua-ink hover:text-ua-bg"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Sign out
          </Link>
        </div>
      </div>
    </header>
  );
}

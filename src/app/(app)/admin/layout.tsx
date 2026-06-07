import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/queries";
import { isAdmin } from "@/lib/admin";

const NAV_LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/students", label: "Students" },
  { href: "/admin/cohorts", label: "Cohorts" },
  { href: "/admin/qa", label: "Q&A" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/broadcast", label: "Broadcast" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!isAdmin(profile)) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-6">
      {/* Admin sub-nav */}
      <nav
        className="flex flex-wrap gap-2 rounded-2xl p-3"
        style={{ backgroundColor: "#fff" }}
        aria-label="Admin navigation"
      >
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-colors hover:bg-[var(--ua-blue)] hover:text-white"
            style={{ color: "var(--ua-ink)" }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Page content */}
      {children}
    </div>
  );
}

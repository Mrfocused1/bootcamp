import Link from "next/link";
import {
  getStudents,
  getLessons,
  getUpcomingSessions,
} from "@/lib/queries";

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

const SECTION_LINKS = [
  { href: "/admin/content", label: "Content", bg: "var(--ua-sky)", desc: "Edit lessons & videos" },
  { href: "/admin/students", label: "Students", bg: "var(--ua-green)", desc: "Manage access & progress" },
  { href: "/admin/cohorts", label: "Cohorts", bg: "var(--ua-pink)", desc: "Cohorts & live sessions" },
  { href: "/admin/qa", label: "Q&A", bg: "#fff", desc: "Review AI conversations" },
  { href: "/admin/announcements", label: "Announcements", bg: "var(--ua-orange)", desc: "Post to all students" },
];

export default async function AdminOverviewPage() {
  const [students, lessons, sessions] = await Promise.all([
    getStudents(),
    getLessons(),
    getUpcomingSessions(),
  ]);

  const nextSession = sessions[0] ?? null;

  const statCards = [
    { label: "Total students", value: students.length, bg: "var(--ua-green)" },
    { label: "Total lessons", value: lessons.length, bg: "var(--ua-sky)" },
    {
      label: "Next session",
      value: nextSession ? formatDate(nextSession.scheduled_at) : "None scheduled",
      bg: "var(--ua-pink)",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <h1
          className="text-3xl font-bold tracking-tight lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          admin overview
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          Bridgeway AI Bootcamp — cohort management dashboard.
        </p>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map(({ label, value, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-5 flex flex-col gap-1"
            style={{ backgroundColor: bg }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              {label}
            </p>
            <p
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              {value}
            </p>
          </div>
        ))}
      </section>

      {/* Section link tiles */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {SECTION_LINKS.map(({ href, label, bg, desc }) => (
          <Link
            key={href}
            href={href}
            className="rounded-2xl p-4 flex flex-col gap-1 transition-opacity hover:opacity-80"
            style={{ backgroundColor: bg }}
          >
            <span
              className="font-bold text-base"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              {label}
            </span>
            <span className="text-xs" style={{ color: "var(--ua-ink)", opacity: 0.6 }}>
              {desc}
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}

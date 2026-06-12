import Link from "next/link";
import {
  getStudents,
  getLessons,
  getUpcomingSessions,
} from "@/lib/queries";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";

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
  { href: "/admin/content", label: "Content", bg: "bg-ua-sky", sticker: "cursor-star", desc: "Edit lessons & videos" },
  { href: "/admin/students", label: "Students", bg: "bg-ua-green", sticker: "high-five", desc: "Manage access & progress" },
  { href: "/admin/cohorts", label: "Cohorts", bg: "bg-ua-pink", sticker: "hundred", desc: "Cohorts & live sessions" },
  { href: "/admin/qa", label: "Q&A", bg: "bg-white", sticker: "peace", desc: "Review AI conversations" },
  { href: "/admin/announcements", label: "Announcements", bg: "bg-ua-orange", sticker: "megaphone", desc: "Post to all students" },
  { href: "/admin/analytics", label: "Analytics", bg: "bg-white", sticker: "shooting-star", desc: "Engagement & progress" },
  { href: "/admin/broadcast", label: "Broadcast", bg: "bg-ua-sky", sticker: "phone-hand", desc: "Email the cohort" },
];

export default async function AdminOverviewPage() {
  const [students, lessons, sessions] = await Promise.all([
    getStudents(),
    getLessons(),
    getUpcomingSessions(),
  ]);

  const nextSession = sessions[0] ?? null;

  const statCards = [
    { label: "Total students", value: students.length, bg: "bg-ua-green", sticker: "high-five" },
    { label: "Total lessons", value: lessons.length, bg: "bg-ua-sky", sticker: "cursor-star" },
    {
      label: "Next session",
      value: nextSession ? formatDate(nextSession.scheduled_at) : "None scheduled",
      bg: "bg-ua-pink",
      sticker: "lets-go",
    },
  ];

  return (
    <div className="space-y-10">
      <Reveal>
        <h1
          className="relative inline-block text-4xl font-black tracking-tight text-ua-ink md:text-5xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          admin overview
          <Sticker
            name="rock-on"
            size={64}
            rotate={12}
            className="pointer-events-none absolute -right-12 -top-7 hidden sm:block"
          />
        </h1>
        <p className="mt-3 text-ua-ink/55">
          Bridgeway AI Bootcamp — cohort management dashboard.
        </p>
      </Reveal>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {statCards.map(({ label, value, bg, sticker }) => (
          <Reveal key={label} className="h-full">
            <div
              className={`relative flex h-full flex-col gap-1 overflow-hidden rounded-3xl border-2 border-ua-ink ${bg} p-6 shadow-[6px_6px_0_var(--ua-ink)]`}
            >
              <Sticker
                name={sticker}
                size={56}
                rotate={-8}
                className="pointer-events-none absolute -right-1 -top-3"
              />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-ua-ink/55">
                {label}
              </p>
              <p
                className="text-2xl font-black text-ua-ink"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                {value}
              </p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* Section tiles */}
      <section className="space-y-5">
        <Reveal>
          <h2
            className="text-2xl font-black lowercase text-ua-ink md:text-3xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            manage
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SECTION_LINKS.map(({ href, label, bg, sticker, desc }, i) => (
            <Reveal key={href} className="h-full" y={24 + i * 4}>
              <Link
                href={href}
                className={`group relative flex h-full flex-col gap-1 overflow-hidden rounded-3xl border-2 border-ua-ink ${bg} p-6 shadow-[6px_6px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5`}
              >
                <Sticker
                  name={sticker}
                  size={52}
                  rotate={8}
                  className="pointer-events-none absolute -right-1 -top-3"
                />
                <span
                  className="text-xl font-black text-ua-ink"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {label}
                </span>
                <span className="text-sm text-ua-ink/65">{desc}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

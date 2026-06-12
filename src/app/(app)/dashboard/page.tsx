import Link from "next/link";
import {
  getCohort,
  getDays,
  getProgressMap,
  getUpcomingSessions,
  getLatestAnnouncement,
} from "@/lib/queries";
import { isDayUnlocked, unlockDate } from "@/lib/access";
import { nextLessonDayIndex } from "@/lib/resume";
import { DayCard } from "@/components/DayCard";
import { ProgressBar } from "@/components/ProgressBar";
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

function formatUnlockDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function DashboardPage() {
  const todayISO = new Date().toISOString().slice(0, 10);

  const [cohort, days, progressMap, sessions, announcement] = await Promise.all(
    [
      getCohort(),
      getDays(),
      getProgressMap(),
      getUpcomingSessions(),
      getLatestAnnouncement(),
    ]
  );

  // Overall progress: average of watched_percent across all 5 lessons
  const lessonIds = days.map((_, i) => `lesson-${i + 1}`);
  const percents = lessonIds.map((id) => progressMap[id]?.watched_percent ?? 0);
  const overallPercent =
    percents.length > 0
      ? Math.round(percents.reduce((a, b) => a + b, 0) / percents.length)
      : 0;

  // Resume target: the day index the student should continue from
  const resumeDayIndex = nextLessonDayIndex(
    days,
    progressMap,
    cohort.start_date,
    todayISO
  );
  const resumeDay = resumeDayIndex !== null
    ? days.find((d) => d.day_index === resumeDayIndex) ?? null
    : null;
  const resumeProgress = resumeDayIndex !== null
    ? progressMap[`lesson-${resumeDayIndex}`] ?? null
    : null;

  const nextSession = sessions[0] ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 md:py-14">
      {/* ── Continue / All caught up ── */}
      <Reveal>
        {resumeDay ? (
          <section className="relative flex flex-col gap-4 overflow-hidden rounded-3xl border-2 border-ua-ink bg-ua-blue p-7 text-ua-bg shadow-[6px_6px_0_var(--ua-ink)] sm:flex-row sm:items-center md:p-9">
            <Sticker
              name="lets-go"
              size={96}
              rotate={-10}
              className="pointer-events-none absolute -right-2 -top-4 hidden sm:block md:right-6"
            />
            <div className="flex-1 space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">
                continue where you left off
              </p>
              <h2
                className="text-2xl font-black leading-tight md:text-3xl"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                Day {resumeDay.day_index} &middot; {resumeDay.title}
              </h2>
              {resumeProgress && resumeProgress.watched_percent > 0 && (
                <div className="max-w-xs space-y-1">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ua-bg/25">
                    <div
                      className="h-full rounded-full bg-ua-bg"
                      style={{ width: `${resumeProgress.watched_percent}%` }}
                    />
                  </div>
                  <p className="text-xs opacity-75">
                    {resumeProgress.watched_percent}% watched
                  </p>
                </div>
              )}
            </div>
            <Link
              href={`/day/${resumeDay.day_index}`}
              className="relative z-10 inline-flex shrink-0 items-center justify-center rounded-full bg-ua-bg px-6 py-3 text-sm font-bold text-ua-blue transition-transform hover:-translate-y-0.5"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              Resume Day {resumeDay.day_index} &rarr;
            </Link>
          </section>
        ) : (
          <section className="relative flex items-center gap-4 overflow-hidden rounded-3xl border-2 border-ua-ink bg-ua-green p-7 text-ua-ink shadow-[6px_6px_0_var(--ua-ink)]">
            <Sticker name="hundred" size={72} rotate={-8} className="shrink-0" />
            <div>
              <h2
                className="text-xl font-black lowercase"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                you&rsquo;re all caught up
              </h2>
              <p className="text-sm text-ua-ink/65">
                Great work — all unlocked lessons are complete.
              </p>
            </div>
          </section>
        )}
      </Reveal>

      {/* ── Heading + overall progress ── */}
      <section className="space-y-5">
        <Reveal>
          <h1
            className="relative inline-block text-4xl font-black tracking-tight text-ua-ink md:text-5xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            your dashboard
            <Sticker
              name="sparkles"
              size={64}
              rotate={12}
              className="pointer-events-none absolute -right-12 -top-7 hidden sm:block"
            />
          </h1>
        </Reveal>
        <Reveal>
          <div className="rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)] md:p-7">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-ua-ink/55">
              Overall course progress
            </p>
            <ProgressBar percent={overallPercent} label={`${overallPercent}% complete`} />
          </div>
        </Reveal>
      </section>

      {/* ── Choose your schedule CTA ── */}
      <Reveal>
        <Link
          href="/book"
          className="group flex items-center gap-4 rounded-3xl border-2 border-ua-ink bg-ua-sky p-6 text-ua-ink shadow-[6px_6px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5"
        >
          <Sticker name="phone-hand" size={56} rotate={-6} className="shrink-0" />
          <div>
            <p
              className="text-lg font-black lowercase"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              choose your study schedule →
            </p>
            <p className="text-sm text-ua-ink/70">
              Pick your start date and daily time — we&rsquo;ll schedule your 5 sessions.
            </p>
          </div>
        </Link>
      </Reveal>

      {/* ── Announcement + next session ── */}
      {(announcement || nextSession) && (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {announcement && (
            <Reveal className="h-full">
              <div className="flex h-full flex-col gap-2 rounded-3xl border-2 border-ua-ink bg-ua-pink p-6 shadow-[6px_6px_0_var(--ua-ink)]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ua-ink/55">
                  Announcement
                </p>
                <h2
                  className="text-xl font-black text-ua-ink"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {announcement.title}
                </h2>
                <p className="text-sm leading-relaxed text-ua-ink/75">
                  {announcement.body}
                </p>
              </div>
            </Reveal>
          )}
          {nextSession && (
            <Reveal className="h-full">
              <div className="flex h-full flex-col gap-2 rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ua-ink/55">
                  Next live session
                </p>
                <h2
                  className="text-xl font-black text-ua-ink"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  Day {nextSession.day_index} Q&amp;A
                </h2>
                <p className="text-sm font-medium text-ua-ink/75">
                  {formatDate(nextSession.scheduled_at)}
                </p>
                <a
                  href={nextSession.zoom_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-ua-blue px-5 py-2.5 text-sm font-bold text-ua-bg transition-transform hover:-translate-y-0.5"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  Join Zoom →
                </a>
              </div>
            </Reveal>
          )}
        </section>
      )}

      {/* ── Day cards ── */}
      <section className="space-y-5">
        <Reveal>
          <h2
            className="text-2xl font-black lowercase text-ua-ink md:text-3xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            your 5 days
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {days.map((day, i) => {
            const unlocked = isDayUnlocked(
              day.day_index,
              cohort.start_date,
              todayISO
            );
            const lessonId = `lesson-${day.day_index}`;
            const progress = progressMap[lessonId];
            const unlockStr = formatUnlockDate(
              unlockDate(day.day_index, cohort.start_date)
            );
            return (
              <Reveal key={day.id} className="h-full" y={28 + i * 4}>
                <DayCard
                  day={day}
                  progress={progress}
                  unlocked={unlocked}
                  unlockDateStr={unlockStr}
                />
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}

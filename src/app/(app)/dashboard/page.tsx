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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-10">
      {/* ── Continue / All caught up card ── */}
      {resumeDay ? (
        <section
          className="rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
        >
          <div className="flex-1 space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest opacity-75"
            >
              continue where you left off
            </p>
            <h2
              className="text-xl font-bold leading-snug"
              style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
            >
              Day {resumeDay.day_index} &middot; {resumeDay.title}
            </h2>
            {resumeProgress && resumeProgress.watched_percent > 0 && (
              <div className="space-y-1 max-w-xs">
                <div
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${resumeProgress.watched_percent}%`,
                      backgroundColor: "#fff",
                    }}
                  />
                </div>
                <p className="text-xs opacity-70">
                  {resumeProgress.watched_percent}% watched
                </p>
              </div>
            )}
          </div>
          <Link
            href={`/day/${resumeDay.day_index}`}
            className="shrink-0 inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85"
            style={{ backgroundColor: "#fff", color: "var(--ua-blue)" }}
          >
            Resume Day {resumeDay.day_index} &rarr;
          </Link>
        </section>
      ) : (
        <section
          className="rounded-2xl p-6 flex items-center gap-4"
          style={{ backgroundColor: "var(--ua-green)" }}
        >
          <span className="text-2xl" aria-hidden="true">🎉</span>
          <div>
            <h2
              className="font-bold text-lg"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              You&rsquo;re all caught up
            </h2>
            <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.65 }}>
              Great work — all unlocked lessons are complete.
            </p>
          </div>
        </section>
      )}

      {/* ── Welcome + Overall progress ── */}
      <section className="flex flex-col gap-4">
        <h1
          className="text-3xl font-bold tracking-tight lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          your dashboard
        </h1>
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "#fff" }}
        >
          <p className="text-sm font-medium mb-3" style={{ color: "var(--ua-ink)", opacity: 0.6 }}>
            Overall course progress
          </p>
          <ProgressBar percent={overallPercent} label={`${overallPercent}% complete`} />
        </div>
      </section>

      {/* ── Choose your schedule CTA ── */}
      <Link
        href="/book"
        className="flex items-center gap-3 rounded-2xl p-5 transition-colors hover:opacity-90"
        style={{ backgroundColor: "var(--ua-blue)", color: "#fff", textDecoration: "none" }}
      >
        <span className="text-2xl" aria-hidden="true">📅</span>
        <div>
          <p
            className="font-bold text-base lowercase"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
          >
            choose your study schedule →
          </p>
          <p className="text-sm opacity-75">
            Pick your start date and daily time — we'll schedule your 5 sessions.
          </p>
        </div>
      </Link>

      {/* ── Announcements + Next session ── */}
      {(announcement || nextSession) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcement && (
            <div
              className="rounded-2xl p-5 flex flex-col gap-2"
              style={{ backgroundColor: "var(--ua-pink)" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--ua-ink)", opacity: 0.5 }}
              >
                Announcement
              </p>
              <h2
                className="font-bold text-lg"
                style={{
                  fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                  color: "var(--ua-ink)",
                }}
              >
                {announcement.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.75 }}>
                {announcement.body}
              </p>
            </div>
          )}
          {nextSession && (
            <div
              className="rounded-2xl p-5 flex flex-col gap-2"
              style={{ backgroundColor: "var(--ua-sky)" }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--ua-ink)", opacity: 0.5 }}
              >
                Next live session
              </p>
              <h2
                className="font-bold text-lg"
                style={{
                  fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                  color: "var(--ua-ink)",
                }}
              >
                Day {nextSession.day_index} Q&amp;A
              </h2>
              <p className="text-sm font-medium" style={{ color: "var(--ua-ink)", opacity: 0.75 }}>
                {formatDate(nextSession.scheduled_at)}
              </p>
              <a
                href={nextSession.zoom_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-colors hover:opacity-80"
                style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
              >
                Join Zoom →
              </a>
            </div>
          )}
        </section>
      )}

      {/* ── Day cards ── */}
      <section className="space-y-4">
        <h2
          className="text-xl font-bold lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          your 5 days
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {days.map((day) => {
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
              <DayCard
                key={day.id}
                day={day}
                progress={progress}
                unlocked={unlocked}
                unlockDateStr={unlockStr}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}

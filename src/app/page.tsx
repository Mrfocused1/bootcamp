import {
  getCohort,
  getDays,
  getProgressMap,
  getUpcomingSessions,
  getLatestAnnouncement,
} from "@/lib/queries";
import { isDayUnlocked, unlockDate } from "@/lib/access";
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

  const nextSession = sessions[0] ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-10">
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

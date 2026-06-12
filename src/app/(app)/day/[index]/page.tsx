import { notFound, redirect } from "next/navigation";
import { getLessonByDayIndex, getCohort, getProgressMap, getRecordingsForDay } from "@/lib/queries";
import { isDayUnlocked } from "@/lib/access";
import { LessonClient } from "@/components/LessonClient";
import { RecordingPlayer } from "@/components/RecordingPlayer";

interface PageProps {
  params: Promise<{ index: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { index: indexStr } = await params;
  const dayIndex = Number(indexStr);

  if (!Number.isInteger(dayIndex) || dayIndex < 1) {
    notFound();
  }

  const result = await getLessonByDayIndex(dayIndex);
  if (!result) notFound();

  const { day, lesson } = result;

  // Access guard — defence-in-depth beyond RLS
  const todayISO = new Date().toISOString().slice(0, 10);
  const cohort = await getCohort();
  if (!isDayUnlocked(dayIndex, cohort.start_date, todayISO)) {
    redirect("/dashboard");
  }

  // Resume position from saved progress
  const progressMap = await getProgressMap();
  const progress = progressMap[lesson.id];
  const startSeconds = progress?.last_position_seconds ?? 0;

  // Next lesson navigation
  const nextIndex = dayIndex + 1;
  const nextUnlocked = nextIndex <= 5 && isDayUnlocked(nextIndex, cohort.start_date, todayISO);

  // Live-session recordings for this day (gated to the student's cohort by RLS)
  const recordings = await getRecordingsForDay(dayIndex);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">
      {/* ── Header ── */}
      <section className="space-y-2">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--ua-ink)", opacity: 0.45 }}
        >
          Day {dayIndex}
        </p>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          {day.title}
        </h1>
        {day.description && (
          <p className="text-base leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.65 }}>
            {day.description}
          </p>
        )}

        {/* Topic pills */}
        {lesson.topics.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {lesson.topics.map((topic) => (
              <span
                key={topic}
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: "var(--ua-sky)", color: "var(--ua-ink)" }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* ── Video + AI assistant ── */}
      <LessonClient
        lessonId={lesson.id}
        videoProvider={lesson.video_provider ?? "mp4"}
        videoId={lesson.video_id ?? ""}
        startSeconds={startSeconds}
        chapters={lesson.chapters}
        durationSeconds={lesson.duration_seconds}
        nextIndex={nextIndex <= 5 ? nextIndex : null}
        nextUnlocked={nextUnlocked}
      />

      {/* ── Session recordings ── */}
      {recordings.length > 0 && (
        <section className="space-y-4">
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--ua-ink)" }}
          >
            Session recordings
          </h2>
          {recordings.map((rec) => (
            <div key={rec.id} className="space-y-2">
              <p className="text-sm font-medium" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
                {rec.title}
              </p>
              <RecordingPlayer url={rec.url} />
            </div>
          ))}
        </section>
      )}

      {/* ── Resources ── */}
      {lesson.resources.length > 0 && (
        <section className="space-y-3">
          <h2
            className="text-lg font-semibold"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "var(--ua-ink)",
            }}
          >
            Resources
          </h2>
          <ul className="flex flex-wrap gap-3">
            {lesson.resources.map((resource) => (
              <li key={resource.url}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--ua-ink)] hover:text-[var(--ua-bg)]"
                  style={{
                    borderColor: "rgba(20,20,20,0.2)",
                    color: "var(--ua-ink)",
                  }}
                >
                  ↓ {resource.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

import { getCohort, getUpcomingSessions } from "@/lib/queries";
import { saveCohort, saveLiveSession } from "@/app/admin/actions";

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

export default async function AdminCohortsPage() {
  const [cohort, sessions] = await Promise.all([
    getCohort(),
    getUpcomingSessions(),
  ]);

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
          cohorts
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          Manage cohorts and upcoming live sessions.
        </p>
      </section>

      {/* Current cohort */}
      <div className="rounded-2xl p-5 space-y-2" style={{ backgroundColor: "var(--ua-sky)" }}>
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--ua-ink)", opacity: 0.5 }}
        >
          Current cohort
        </p>
        <p
          className="font-bold text-xl"
          style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--ua-ink)" }}
        >
          {cohort.name}
        </p>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
          Starts: {cohort.start_date}
        </p>
      </div>

      {/* Create cohort form */}
      <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "#fff" }}>
        <h2
          className="font-bold text-lg"
          style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--ua-ink)" }}
        >
          Create new cohort
        </h2>
        <form action={saveCohort} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cohort-name"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Cohort name
            </label>
            <input
              id="cohort-name"
              name="name"
              placeholder="e.g. August 2026 Cohort"
              required
              className="rounded-xl border border-[var(--ua-ink)]/20 bg-[var(--ua-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
              style={{ color: "var(--ua-ink)" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cohort-start"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Start date
            </label>
            <input
              id="cohort-start"
              name="start_date"
              type="date"
              required
              className="rounded-xl border border-[var(--ua-ink)]/20 bg-[var(--ua-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
              style={{ color: "var(--ua-ink)" }}
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Create cohort
            </button>
          </div>
        </form>
      </div>

      {/* Upcoming sessions */}
      <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "#fff" }}>
        <h2
          className="font-bold text-lg"
          style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--ua-ink)" }}
        >
          Upcoming live sessions
        </h2>
        {sessions.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
            No sessions scheduled.
          </p>
        ) : (
          <ul className="space-y-2">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 rounded-xl p-3"
                style={{ backgroundColor: "var(--ua-bg)" }}
              >
                <div>
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "var(--ua-ink)" }}
                  >
                    Day {s.day_index} Q&amp;A
                  </span>
                  <span className="mx-2 text-sm" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>·</span>
                  <span className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
                    {formatDate(s.scheduled_at)}
                  </span>
                </div>
                <a
                  href={s.zoom_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold underline underline-offset-2"
                  style={{ color: "var(--ua-blue)" }}
                >
                  Zoom link
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add live session form */}
      <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "#fff" }}>
        <h2
          className="font-bold text-lg"
          style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif", color: "var(--ua-ink)" }}
        >
          Add live session
        </h2>
        <form action={saveLiveSession} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="session-day"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Day index
            </label>
            <input
              id="session-day"
              name="day_index"
              type="number"
              min="1"
              max="5"
              placeholder="e.g. 4"
              required
              className="rounded-xl border border-[var(--ua-ink)]/20 bg-[var(--ua-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
              style={{ color: "var(--ua-ink)" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="session-at"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Scheduled at
            </label>
            <input
              id="session-at"
              name="scheduled_at"
              type="datetime-local"
              required
              className="rounded-xl border border-[var(--ua-ink)]/20 bg-[var(--ua-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
              style={{ color: "var(--ua-ink)" }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="session-zoom"
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Zoom URL
            </label>
            <input
              id="session-zoom"
              name="zoom_url"
              type="url"
              placeholder="https://zoom.us/j/..."
              required
              className="rounded-xl border border-[var(--ua-ink)]/20 bg-[var(--ua-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
              style={{ color: "var(--ua-ink)" }}
            />
          </div>
          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Add session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

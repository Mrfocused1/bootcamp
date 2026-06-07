import { getStudents, getDayFunnel } from "@/lib/queries";
import {
  averageCompletion,
  completionBuckets,
  atRiskStudents,
  dropoffByDay,
} from "@/lib/analytics";
import { nudgeStudentAction } from "@/app/(app)/admin/actions";

export default async function AdminAnalyticsPage() {
  const [students, funnelRaw] = await Promise.all([getStudents(), getDayFunnel()]);

  const avgPct = averageCompletion(students);
  const buckets = completionBuckets(students);
  const atRisk = atRiskStudents(students);
  const funnel = dropoffByDay(funnelRaw);

  const maxStarted = Math.max(...funnel.map((r) => r.started), 1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-1">
        <h1
          className="text-3xl font-bold tracking-tight lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          analytics
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          Cohort completion and engagement at a glance.
        </p>
      </section>

      {/* Stat cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Avg completion", value: `${avgPct}%`, bg: "var(--ua-sky)" },
          { label: "Total students", value: students.length, bg: "var(--ua-green)" },
          { label: "At-risk students", value: atRisk.length, bg: "var(--ua-orange)" },
        ].map(({ label, value, bg }) => (
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

      {/* Completion distribution */}
      <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "#fff" }}>
        <h2
          className="font-bold text-lg lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          completion distribution
        </h2>
        <div className="space-y-2">
          {buckets.map(({ label, count }) => {
            const pct = students.length === 0 ? 0 : Math.round((count / students.length) * 100);
            return (
              <div key={label} className="flex items-center gap-3">
                <span
                  className="w-14 text-xs font-semibold text-right shrink-0"
                  style={{ color: "var(--ua-ink)", opacity: 0.6 }}
                >
                  {label}
                </span>
                <div
                  className="flex-1 rounded-full h-5 relative"
                  style={{ backgroundColor: "rgba(20,20,20,0.08)" }}
                >
                  <div
                    className="h-5 rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: "var(--ua-blue)",
                      minWidth: count > 0 ? "4px" : "0",
                    }}
                  />
                </div>
                <span
                  className="w-6 text-xs font-bold shrink-0"
                  style={{ color: "var(--ua-ink)" }}
                >
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drop-off by day */}
      <div className="rounded-2xl p-5 space-y-4" style={{ backgroundColor: "#fff" }}>
        <h2
          className="font-bold text-lg lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          drop-off by day
        </h2>
        <div className="space-y-3">
          {funnel.map(({ day, started, completed, dropPercent }) => (
            <div key={day} className="space-y-1">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                >
                  Day {day}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: dropPercent >= 50 ? "var(--ua-orange)" : "var(--ua-ink)",
                    opacity: dropPercent >= 50 ? 1 : 0.55,
                  }}
                >
                  {dropPercent}% drop-off
                </span>
              </div>
              {/* Started bar */}
              <div
                className="h-4 rounded-full"
                style={{ backgroundColor: "rgba(20,20,20,0.08)" }}
              >
                <div
                  className="h-4 rounded-full"
                  style={{
                    width: `${Math.round((started / maxStarted) * 100)}%`,
                    backgroundColor: "var(--ua-sky)",
                  }}
                />
              </div>
              {/* Completed bar */}
              <div
                className="h-4 rounded-full"
                style={{ backgroundColor: "rgba(20,20,20,0.08)" }}
              >
                <div
                  className="h-4 rounded-full"
                  style={{
                    width: `${Math.round((completed / maxStarted) * 100)}%`,
                    backgroundColor: "var(--ua-green)",
                  }}
                />
              </div>
              <div className="flex gap-4 text-xs" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
                <span>
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: "var(--ua-sky)" }}
                  />
                  Started: {started}
                </span>
                <span>
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: "var(--ua-green)" }}
                  />
                  Completed: {completed}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* At-risk students table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#fff" }}>
        <div className="p-5 pb-2">
          <h2
            className="font-bold text-lg lowercase"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "var(--ua-ink)",
            }}
          >
            at-risk students
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
            Students at or below 25% completion.
          </p>
        </div>

        {atRisk.length === 0 ? (
          <p className="p-5 text-sm" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
            No at-risk students — great job!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(20,20,20,0.1)" }}>
                  {["Name", "Email", "Completion", ""].map((h) => (
                    <th
                      key={h}
                      className="py-3 px-4 text-left font-semibold text-xs uppercase tracking-widest"
                      style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {atRisk.map(({ profile, overallPercent }) => (
                  <tr
                    key={profile.id}
                    style={{ borderBottom: "1px solid rgba(20,20,20,0.06)" }}
                  >
                    <td className="py-3 px-4 font-medium" style={{ color: "var(--ua-ink)" }}>
                      {profile.name}
                    </td>
                    <td
                      className="py-3 px-4"
                      style={{ color: "var(--ua-ink)", opacity: 0.7 }}
                    >
                      {profile.email}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2 rounded-full flex-1 max-w-[80px]"
                          style={{ backgroundColor: "rgba(20,20,20,0.1)" }}
                        >
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${overallPercent}%`,
                              backgroundColor: "var(--ua-orange)",
                            }}
                          />
                        </div>
                        <span style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
                          {overallPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <form action={nudgeStudentAction.bind(null, profile.id)}>
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-80"
                          style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
                        >
                          Nudge
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

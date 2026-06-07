import { getUpcomingSessions } from "@/lib/queries";
import { SessionRow } from "@/components/SessionRow";

export default async function SchedulePage() {
  const sessions = await getUpcomingSessions();

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">
      <section className="space-y-1">
        <h1
          className="text-3xl font-bold tracking-tight lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          schedule
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          Upcoming live sessions — join on Zoom at the scheduled time.
        </p>
      </section>

      {sessions.length === 0 ? (
        <div
          className="rounded-2xl p-8 text-center"
          style={{ backgroundColor: "#fff" }}
        >
          <p className="text-base" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
            No upcoming sessions scheduled right now. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <SessionRow key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}

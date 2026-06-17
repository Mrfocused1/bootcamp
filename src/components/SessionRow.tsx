import type { LiveSession } from "@/lib/types";

interface SessionRowProps {
  session: LiveSession;
}

function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export function SessionRow({ session }: SessionRowProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      style={{ backgroundColor: "#fff" }}
    >
      <div className="space-y-1">
        <p
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--ua-ink)", opacity: 0.45 }}
        >
          Live session
        </p>
        <h2
          className="font-bold text-lg"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          Day {session.day_index} live session
        </h2>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.65 }}>
          {formatDateTime(session.scheduled_at)}
        </p>
      </div>

      {session.zoom_url ? (
        <a
          href={session.zoom_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 whitespace-nowrap"
          style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
        >
          Join Zoom →
        </a>
      ) : (
        <span
          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap"
          style={{ backgroundColor: "var(--ua-bg)", color: "var(--ua-ink)", opacity: 0.6 }}
        >
          Link coming
        </span>
      )}
    </div>
  );
}

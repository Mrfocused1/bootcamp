import Link from "next/link";
import type { Day, Progress } from "@/lib/types";

type DayStatus = "completed" | "in-progress" | "not-started" | "locked";

interface DayCardProps {
  day: Day;
  progress: Progress | undefined;
  unlocked: boolean;
  unlockDateStr: string; // formatted date string for locked days
}

function getStatus(
  progress: Progress | undefined,
  unlocked: boolean
): DayStatus {
  if (!unlocked) return "locked";
  if (!progress) return "not-started";
  if (progress.completed || progress.watched_percent >= 90) return "completed";
  if (progress.watched_percent > 0) return "in-progress";
  return "not-started";
}

const statusConfig: Record<
  DayStatus,
  { badge: string; badgeBg: string; badgeColor: string }
> = {
  completed: {
    badge: "✓ Completed",
    badgeBg: "var(--ua-green)",
    badgeColor: "var(--ua-ink)",
  },
  "in-progress": {
    badge: "● In progress",
    badgeBg: "var(--ua-sky)",
    badgeColor: "var(--ua-ink)",
  },
  "not-started": {
    badge: "Not started",
    badgeBg: "transparent",
    badgeColor: "var(--ua-ink)",
  },
  locked: {
    badge: "🔒 Locked",
    badgeBg: "var(--ua-ink)",
    badgeColor: "var(--ua-bg)",
  },
};

export function DayCard({ day, progress, unlocked, unlockDateStr }: DayCardProps) {
  const status = getStatus(progress, unlocked);
  const { badge, badgeBg, badgeColor } = statusConfig[status];

  const cardContent = (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3 h-full transition-shadow duration-200"
      style={{
        backgroundColor: status === "locked" ? "var(--ua-ink)/5" : "#fff",
        borderColor:
          status === "completed"
            ? "var(--ua-green)"
            : status === "in-progress"
            ? "var(--ua-sky)"
            : "var(--ua-ink)/15",
        opacity: status === "locked" ? 0.7 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0"
          style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
        >
          {day.day_index}
        </span>
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border"
          style={{
            backgroundColor: badgeBg,
            color: badgeColor,
            borderColor:
              status === "not-started" ? "var(--ua-ink)/20" : "transparent",
          }}
        >
          {badge}
        </span>
      </div>

      {/* Title */}
      <h2
        className="font-bold text-lg leading-tight"
        style={{
          fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
          color: "var(--ua-ink)",
        }}
      >
        {day.title}
      </h2>

      {/* Description */}
      <p className="text-sm leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.65 }}>
        {day.description}
      </p>

      {/* Topics */}
      {progress?.watched_percent !== undefined && progress.watched_percent > 0 && (
        <div className="mt-1">
          <div
            className="h-1.5 w-full rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--ua-ink)", opacity: 0.12 }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress.watched_percent}%`,
                backgroundColor: "var(--ua-blue)",
                opacity: 1,
              }}
            />
          </div>
        </div>
      )}

      {/* Lock notice */}
      {status === "locked" && (
        <p className="text-xs font-medium" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
          Unlocks {unlockDateStr}
        </p>
      )}
    </div>
  );

  if (unlocked) {
    return (
      <Link
        href={`/day/${day.day_index}`}
        className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ua-blue)]"
        aria-label={`Day ${day.day_index}: ${day.title}`}
      >
        {cardContent}
      </Link>
    );
  }

  return (
    <div aria-label={`Day ${day.day_index}: ${day.title} — locked`}>
      {cardContent}
    </div>
  );
}

import type { Day, Progress } from "@/lib/types";
import { isDayUnlocked } from "@/lib/access";

/**
 * Returns the day_index of the lesson the student should resume next.
 *
 * Algorithm:
 *  1. Collect all days that are unlocked.
 *  2. Among those, prefer the first one that is in-progress
 *     (watched_percent > 0 && !completed).
 *  3. If none are in-progress, return the first not-started unlocked day.
 *  4. If all unlocked days are completed, return null.
 */
export function nextLessonDayIndex(
  days: Day[],
  progressMap: Record<string, Progress>,
  cohortStart: string,
  todayISO: string
): number | null {
  const sorted = [...days].sort((a, b) => a.day_index - b.day_index);

  const unlocked = sorted.filter((d) =>
    isDayUnlocked(d.day_index, cohortStart, todayISO)
  );

  // First pass: in-progress (started but not completed)
  const inProgress = unlocked.find((d) => {
    const p = progressMap[`lesson-${d.day_index}`];
    return p && p.watched_percent > 0 && !p.completed;
  });
  if (inProgress) return inProgress.day_index;

  // Second pass: not started (no progress entry, or watched_percent === 0 and not completed)
  const notStarted = unlocked.find((d) => {
    const p = progressMap[`lesson-${d.day_index}`];
    return !p || (p.watched_percent === 0 && !p.completed);
  });
  if (notStarted) return notStarted.day_index;

  // All unlocked lessons are completed
  return null;
}

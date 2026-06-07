import type { StudentSummary } from "@/lib/types";

export interface CompletionBucket {
  label: string;
  count: number;
}

export interface DayFunnelRow {
  day: number;
  started: number;
  completed: number;
  dropPercent: number;
}

/**
 * Average overallPercent across all students, rounded to nearest integer.
 * Returns 0 for an empty list.
 */
export function averageCompletion(students: StudentSummary[]): number {
  if (students.length === 0) return 0;
  const sum = students.reduce((acc, s) => acc + s.overallPercent, 0);
  return Math.round(sum / students.length);
}

/**
 * Counts students in each completion range.
 */
export function completionBuckets(students: StudentSummary[]): CompletionBucket[] {
  const buckets: CompletionBucket[] = [
    { label: "0%", count: 0 },
    { label: "1–25%", count: 0 },
    { label: "26–50%", count: 0 },
    { label: "51–75%", count: 0 },
    { label: "76–99%", count: 0 },
    { label: "100%", count: 0 },
  ];

  for (const s of students) {
    const p = s.overallPercent;
    if (p === 0) buckets[0].count++;
    else if (p <= 25) buckets[1].count++;
    else if (p <= 50) buckets[2].count++;
    else if (p <= 75) buckets[3].count++;
    else if (p < 100) buckets[4].count++;
    else buckets[5].count++;
  }

  return buckets;
}

/**
 * Returns students at or below `thresholdPercent` (default 25).
 */
export function atRiskStudents(
  students: StudentSummary[],
  thresholdPercent = 25
): StudentSummary[] {
  return students.filter((s) => s.overallPercent <= thresholdPercent);
}

/**
 * Computes drop-off percent per day.
 * dropPercent = round((started - completed) / started * 100), 0 if started === 0.
 */
export function dropoffByDay(
  perDayCounts: { day: number; started: number; completed: number }[]
): DayFunnelRow[] {
  return perDayCounts.map(({ day, started, completed }) => {
    const dropPercent =
      started === 0 ? 0 : Math.round(((started - completed) / started) * 100);
    return { day, started, completed, dropPercent };
  });
}

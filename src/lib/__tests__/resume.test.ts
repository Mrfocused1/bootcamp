import { describe, it, expect } from "vitest";
import { nextLessonDayIndex } from "@/lib/resume";
import type { Day, Progress } from "@/lib/types";

const TODAY = new Date().toISOString().slice(0, 10);

const DAYS: Day[] = [
  { id: "day-1", day_index: 1, title: "Day 1", description: "" },
  { id: "day-2", day_index: 2, title: "Day 2", description: "" },
  { id: "day-3", day_index: 3, title: "Day 3", description: "" },
  { id: "day-4", day_index: 4, title: "Day 4", description: "" },
  { id: "day-5", day_index: 5, title: "Day 5", description: "" },
];

// Cohort started 0 days ago → only day 1 unlocked
const START_TODAY = TODAY;

// Cohort started 3 days ago → days 1-4 unlocked (day 1=+0, 2=+1, 3=+2, 4=+3)
const COHORT_4_DAYS: string = (() => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 3);
  return d.toISOString().slice(0, 10);
})();

describe("nextLessonDayIndex", () => {
  it("returns 2 when day1 is completed and day2 is in-progress (days 1-4 unlocked)", () => {
    const progressMap: Record<string, Progress> = {
      "lesson-1": { lesson_id: "lesson-1", last_position_seconds: 600, watched_percent: 100, completed: true },
      "lesson-2": { lesson_id: "lesson-2", last_position_seconds: 300, watched_percent: 45, completed: false },
    };
    const result = nextLessonDayIndex(DAYS, progressMap, COHORT_4_DAYS, TODAY);
    expect(result).toBe(2);
  });

  it("returns 3 when days 1 and 2 are completed and day3 is not started (days 1-4 unlocked)", () => {
    const progressMap: Record<string, Progress> = {
      "lesson-1": { lesson_id: "lesson-1", last_position_seconds: 600, watched_percent: 100, completed: true },
      "lesson-2": { lesson_id: "lesson-2", last_position_seconds: 596, watched_percent: 100, completed: true },
    };
    const result = nextLessonDayIndex(DAYS, progressMap, COHORT_4_DAYS, TODAY);
    expect(result).toBe(3);
  });

  it("returns null when all unlocked lessons are completed", () => {
    const progressMap: Record<string, Progress> = {
      "lesson-1": { lesson_id: "lesson-1", last_position_seconds: 596, watched_percent: 100, completed: true },
      "lesson-2": { lesson_id: "lesson-2", last_position_seconds: 596, watched_percent: 100, completed: true },
      "lesson-3": { lesson_id: "lesson-3", last_position_seconds: 596, watched_percent: 100, completed: true },
      "lesson-4": { lesson_id: "lesson-4", last_position_seconds: 596, watched_percent: 100, completed: true },
    };
    const result = nextLessonDayIndex(DAYS, progressMap, COHORT_4_DAYS, TODAY);
    expect(result).toBeNull();
  });

  it("returns 1 when nothing is started (day 1 unlocked only)", () => {
    const progressMap: Record<string, Progress> = {};
    const result = nextLessonDayIndex(DAYS, progressMap, START_TODAY, TODAY);
    expect(result).toBe(1);
  });

  it("prefers in-progress over not-started when multiple unlocked days exist", () => {
    // Day 1 completed, Day 2 not started, Day 3 in-progress — but only days 1-4 unlocked
    const progressMap: Record<string, Progress> = {
      "lesson-1": { lesson_id: "lesson-1", last_position_seconds: 596, watched_percent: 100, completed: true },
      "lesson-3": { lesson_id: "lesson-3", last_position_seconds: 100, watched_percent: 20, completed: false },
    };
    // day2 is not started, day3 is in-progress → should return 3
    const result = nextLessonDayIndex(DAYS, progressMap, COHORT_4_DAYS, TODAY);
    expect(result).toBe(3);
  });

  it("returns null when there are no days", () => {
    const result = nextLessonDayIndex([], {}, COHORT_4_DAYS, TODAY);
    expect(result).toBeNull();
  });
});

import { describe, it, expect } from "vitest";
import {
  averageCompletion,
  completionBuckets,
  atRiskStudents,
  dropoffByDay,
} from "@/lib/analytics";
import type { StudentSummary } from "@/lib/types";

const cohort = { id: "c1", name: "Test Cohort", start_date: "2026-06-01" };

function makeStudent(id: string, pct: number): StudentSummary {
  return {
    profile: { id, name: `Student ${id}`, email: `${id}@test.com`, role: "student" },
    cohort,
    overallPercent: pct,
  };
}

describe("averageCompletion", () => {
  it("returns 0 for an empty list", () => {
    expect(averageCompletion([])).toBe(0);
  });

  it("returns the percent for a single student", () => {
    expect(averageCompletion([makeStudent("a", 60)])).toBe(60);
  });

  it("rounds the average", () => {
    // (10 + 20 + 30) / 3 = 20
    expect(averageCompletion([makeStudent("a", 10), makeStudent("b", 20), makeStudent("c", 30)])).toBe(20);
  });

  it("rounds up when needed", () => {
    // (0 + 1) / 2 = 0.5 → rounds to 1
    expect(averageCompletion([makeStudent("a", 0), makeStudent("b", 1)])).toBe(1);
  });
});

describe("completionBuckets", () => {
  it("returns all zero counts for empty list", () => {
    const buckets = completionBuckets([]);
    expect(buckets.every((b) => b.count === 0)).toBe(true);
    expect(buckets).toHaveLength(6);
  });

  it("places 0% students in the first bucket", () => {
    const buckets = completionBuckets([makeStudent("a", 0), makeStudent("b", 0)]);
    expect(buckets[0]).toEqual({ label: "0%", count: 2 });
  });

  it("places 100% students in the last bucket", () => {
    const buckets = completionBuckets([makeStudent("a", 100)]);
    expect(buckets[5]).toEqual({ label: "100%", count: 1 });
  });

  it("correctly bins a spread of students", () => {
    const students = [
      makeStudent("a", 0),    // 0%
      makeStudent("b", 10),   // 1–25
      makeStudent("c", 25),   // 1–25
      makeStudent("d", 30),   // 26–50
      makeStudent("e", 50),   // 26–50
      makeStudent("f", 60),   // 51–75
      makeStudent("g", 75),   // 51–75
      makeStudent("h", 80),   // 76–99
      makeStudent("i", 99),   // 76–99
      makeStudent("j", 100),  // 100%
    ];
    const buckets = completionBuckets(students);
    expect(buckets[0].count).toBe(1);
    expect(buckets[1].count).toBe(2);
    expect(buckets[2].count).toBe(2);
    expect(buckets[3].count).toBe(2);
    expect(buckets[4].count).toBe(2);
    expect(buckets[5].count).toBe(1);
  });
});

describe("atRiskStudents", () => {
  it("returns empty for no students", () => {
    expect(atRiskStudents([])).toHaveLength(0);
  });

  it("uses default threshold of 25", () => {
    const students = [
      makeStudent("a", 0),
      makeStudent("b", 25),
      makeStudent("c", 26),
      makeStudent("d", 80),
    ];
    const at_risk = atRiskStudents(students);
    expect(at_risk).toHaveLength(2);
    expect(at_risk.map((s) => s.overallPercent)).toEqual([0, 25]);
  });

  it("respects a custom threshold", () => {
    const students = [makeStudent("a", 0), makeStudent("b", 50), makeStudent("c", 100)];
    expect(atRiskStudents(students, 50)).toHaveLength(2);
  });

  it("returns empty when all students are above threshold", () => {
    const students = [makeStudent("a", 80), makeStudent("b", 90)];
    expect(atRiskStudents(students, 25)).toHaveLength(0);
  });
});

describe("dropoffByDay", () => {
  it("returns an empty array for empty input", () => {
    expect(dropoffByDay([])).toEqual([]);
  });

  it("computes drop percent correctly", () => {
    const result = dropoffByDay([{ day: 1, started: 20, completed: 18 }]);
    expect(result[0].dropPercent).toBe(10); // (20-18)/20*100 = 10
  });

  it("returns 0 dropPercent when started is 0", () => {
    const result = dropoffByDay([{ day: 1, started: 0, completed: 0 }]);
    expect(result[0].dropPercent).toBe(0);
  });

  it("computes a realistic day funnel", () => {
    const input = [
      { day: 1, started: 20, completed: 18 },
      { day: 2, started: 20, completed: 14 },
      { day: 3, started: 18, completed: 9 },
      { day: 4, started: 15, completed: 6 },
      { day: 5, started: 12, completed: 4 },
    ];
    const result = dropoffByDay(input);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual({ day: 1, started: 20, completed: 18, dropPercent: 10 });
    expect(result[1]).toEqual({ day: 2, started: 20, completed: 14, dropPercent: 30 });
    expect(result[2]).toEqual({ day: 3, started: 18, completed: 9, dropPercent: 50 });
    expect(result[3]).toEqual({ day: 4, started: 15, completed: 6, dropPercent: 60 });
    expect(result[4]).toEqual({ day: 5, started: 12, completed: 4, dropPercent: Math.round((12 - 4) / 12 * 100) });
  });
});

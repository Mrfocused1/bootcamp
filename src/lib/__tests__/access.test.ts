import { describe, it, expect } from "vitest";
import { maxUnlockedDay, isDayUnlocked, unlockDate } from "@/lib/access";

describe("maxUnlockedDay", () => {
  it("day1 unlocked on start date", () =>
    expect(maxUnlockedDay("2026-06-01", "2026-06-01")).toBe(1));
  it("day3 on day 3", () =>
    expect(maxUnlockedDay("2026-06-01", "2026-06-03")).toBe(3));
  it("caps at 5", () =>
    expect(maxUnlockedDay("2026-06-01", "2026-07-01")).toBe(5));
  it("0 before start", () =>
    expect(maxUnlockedDay("2026-06-10", "2026-06-01")).toBe(0));

  // FIX 1: datetime strings (ISO 8601 with time component)
  it("handles datetime string in today param", () =>
    expect(maxUnlockedDay("2026-06-01", "2026-06-03T23:59:59Z")).toBe(3));
  it("handles datetime string in startDate param", () =>
    expect(maxUnlockedDay("2026-06-01T00:00:00Z", "2026-06-03")).toBe(3));

  // FIX 4: one day before start returns 0
  it("0 when today is one day before start", () =>
    expect(maxUnlockedDay("2026-06-02", "2026-06-01")).toBe(0));
});

describe("isDayUnlocked", () => {
  it("isDayUnlocked true", () =>
    expect(isDayUnlocked(2, "2026-06-01", "2026-06-02")).toBe(true));
  it("isDayUnlocked false (locked)", () =>
    expect(isDayUnlocked(4, "2026-06-01", "2026-06-02")).toBe(false));

  // FIX 2: dayIndex < 1 must return false
  it("returns false for dayIndex 0", () =>
    expect(isDayUnlocked(0, "2026-06-01", "2026-06-02")).toBe(false));
});

describe("unlockDate", () => {
  it("unlockDate of day 4", () =>
    expect(unlockDate(4, "2026-06-01")).toBe("2026-06-04"));

  // FIX 4: day 1 unlock date equals startDate
  it("unlockDate of day 1 equals startDate", () =>
    expect(unlockDate(1, "2026-06-01")).toBe("2026-06-01"));
});

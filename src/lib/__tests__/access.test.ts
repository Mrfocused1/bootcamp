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
});

describe("isDayUnlocked", () => {
  it("isDayUnlocked true", () =>
    expect(isDayUnlocked(2, "2026-06-01", "2026-06-02")).toBe(true));
  it("isDayUnlocked false (locked)", () =>
    expect(isDayUnlocked(4, "2026-06-01", "2026-06-02")).toBe(false));
});

describe("unlockDate", () => {
  it("unlockDate of day 4", () =>
    expect(unlockDate(4, "2026-06-01")).toBe("2026-06-04"));
});

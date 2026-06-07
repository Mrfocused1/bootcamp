import { describe, it, expect } from "vitest";
import { addDaysISO, monthGrid, isPastISO } from "@/lib/calendar";

describe("addDaysISO", () => {
  it("adds zero days", () => expect(addDaysISO("2026-06-08", 0)).toBe("2026-06-08"));
  it("adds one day within month", () => expect(addDaysISO("2026-06-08", 1)).toBe("2026-06-09"));
  it("crosses month boundary", () => expect(addDaysISO("2026-06-30", 1)).toBe("2026-07-01"));
  it("crosses year boundary", () => expect(addDaysISO("2025-12-31", 1)).toBe("2026-01-01"));
  it("adds 4 days for 5-session span", () => expect(addDaysISO("2026-06-08", 4)).toBe("2026-06-12"));
  it("subtracts days with negative n", () => expect(addDaysISO("2026-07-01", -1)).toBe("2026-06-30"));
});

describe("monthGrid — June 2026", () => {
  // June 2026: 1st is a Monday → firstDow = 0 → no leading nulls
  const grid = monthGrid(2026, 6);

  it("has 5 weeks", () => expect(grid).toHaveLength(5));
  it("total cells = 35", () => expect(grid.flat()).toHaveLength(35));

  it("first cell is 2026-06-01 (Mon, no leading nulls)", () => {
    expect(grid[0][0]).toBe("2026-06-01");
  });

  it("2026-06-01 lands on Monday (index 0)", () => {
    const row0 = grid[0];
    const idx = row0.indexOf("2026-06-01");
    expect(idx).toBe(0); // Monday = index 0
  });

  it("last non-null cell is 2026-06-30", () => {
    const flat = grid.flat().filter(Boolean);
    expect(flat[flat.length - 1]).toBe("2026-06-30");
  });

  it("all non-null dates are in order", () => {
    const dates = grid.flat().filter((c): c is string => c !== null);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] > dates[i - 1]).toBe(true);
    }
  });

  it("non-null dates are all in June 2026", () => {
    const dates = grid.flat().filter((c): c is string => c !== null);
    dates.forEach((d) => expect(d.startsWith("2026-06-")).toBe(true));
  });
});

describe("monthGrid — May 2026", () => {
  // May 2026: 1st is a Friday → Mon=0,Tue=1,Wed=2,Thu=3,Fri=4 → 4 leading nulls
  const grid = monthGrid(2026, 5);

  it("first row has 4 leading nulls", () => {
    const row0 = grid[0];
    const leadingNulls = row0.findIndex((c) => c !== null);
    expect(leadingNulls).toBe(4);
  });

  it("2026-05-01 is at index 4 in first row", () => {
    expect(grid[0][4]).toBe("2026-05-01");
  });

  it("total cells divisible by 7", () => {
    expect(grid.flat().length % 7).toBe(0);
  });
});

describe("monthGrid — February 2026 (non-leap)", () => {
  const grid = monthGrid(2026, 2);
  const dates = grid.flat().filter((c): c is string => c !== null);

  it("has 28 days", () => expect(dates).toHaveLength(28));
  it("last day is 2026-02-28", () => expect(dates[dates.length - 1]).toBe("2026-02-28"));
});

describe("isPastISO", () => {
  it("returns true when date is before today", () =>
    expect(isPastISO("2026-06-07", "2026-06-08")).toBe(true));
  it("returns false when date equals today", () =>
    expect(isPastISO("2026-06-08", "2026-06-08")).toBe(false));
  it("returns false when date is after today", () =>
    expect(isPastISO("2026-06-09", "2026-06-08")).toBe(false));
  it("works across month boundary", () =>
    expect(isPastISO("2026-05-31", "2026-06-01")).toBe(true));
  it("works across year boundary", () =>
    expect(isPastISO("2025-12-31", "2026-01-01")).toBe(true));
});

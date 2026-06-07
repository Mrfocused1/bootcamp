import { describe, it, expect } from "vitest";
import { computeWatched, isComplete } from "@/lib/progress";

describe("computeWatched", () => {
  it("half", () => expect(computeWatched(30, 60)).toBe(50));
  it("clamps over 100", () => expect(computeWatched(120, 60)).toBe(100));
  it("zero duration -> 0", () => expect(computeWatched(10, 0)).toBe(0));
  it("never negative", () => expect(computeWatched(-5, 60)).toBe(0));
});

describe("isComplete", () => {
  it("complete at 90", () => expect(isComplete(90)).toBe(true));
  it("not complete at 89", () => expect(isComplete(89)).toBe(false));
});

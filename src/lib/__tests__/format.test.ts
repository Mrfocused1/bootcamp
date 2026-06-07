import { describe, it, expect } from "vitest";
import { formatTimestamp } from "@/lib/format";

describe("formatTimestamp", () => {
  it('returns "0:00" for 0 seconds', () => {
    expect(formatTimestamp(0)).toBe("0:00");
  });

  it('returns "0:05" for 5 seconds', () => {
    expect(formatTimestamp(5)).toBe("0:05");
  });

  it('returns "1:05" for 65 seconds', () => {
    expect(formatTimestamp(65)).toBe("1:05");
  });

  it('returns "3:00" for 180 seconds', () => {
    expect(formatTimestamp(180)).toBe("3:00");
  });

  it('returns "10:00" for 600 seconds', () => {
    expect(formatTimestamp(600)).toBe("10:00");
  });
});

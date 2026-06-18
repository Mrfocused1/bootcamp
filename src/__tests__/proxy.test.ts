import { describe, expect, it } from "vitest";
import { config } from "@/proxy";

describe("proxy gate matcher", () => {
  it("gates exactly the authenticated app prefixes (no /api or marketing)", () => {
    expect(config.matcher).toEqual([
      "/dashboard/:path*",
      "/day/:path*",
      "/schedule/:path*",
      "/book/:path*",
      "/onboarding/:path*",
      "/admin/:path*",
    ]);
  });
});

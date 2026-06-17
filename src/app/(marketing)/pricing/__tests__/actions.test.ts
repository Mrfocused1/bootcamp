import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/mock", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mock")>("@/lib/mock");
  return { ...actual, IS_MOCK: true };
});
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));

describe("startEnrolmentCheckout", () => {
  beforeEach(() => vi.resetModules());

  it("redirects to the success page in mock mode", async () => {
    const { startEnrolmentCheckout } = await import("@/app/(marketing)/pricing/actions");
    await expect(startEnrolmentCheckout()).rejects.toThrow(/REDIRECT:.*\/pricing\/success/);
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

vi.mock("stripe", () => ({
  default: vi.fn(function () {
    return { checkout: { sessions: { create: createMock } } };
  }),
}));
vi.mock("@/lib/env.server", () => ({
  getServerEnv: () => ({ STRIPE_SECRET_KEY: "sk_test_x" }),
}));

describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.resetModules();
    createMock.mockReset();
    delete process.env.STRIPE_PRICE_ID;
  });

  it("no-ops in mock mode and returns the success url", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: true }));
    const { createCheckoutSession } = await import("@/lib/stripe");
    const res = await createCheckoutSession({ successUrl: "https://x/success", cancelUrl: "https://x/cancel" });
    expect(res).toEqual({ ok: true, url: "https://x/success", mocked: true });
    expect(createMock).not.toHaveBeenCalled();
  });

  it("creates a Checkout Session and returns its url in real mode", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    process.env.STRIPE_PRICE_ID = "price_123";
    createMock.mockResolvedValue({ url: "https://checkout.stripe.com/c/sess_1" });
    const { createCheckoutSession } = await import("@/lib/stripe");
    const res = await createCheckoutSession({ successUrl: "https://x/success", cancelUrl: "https://x/cancel" });
    expect(res).toEqual({ ok: true, url: "https://checkout.stripe.com/c/sess_1" });
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_123", quantity: 1 }],
        success_url: "https://x/success",
        cancel_url: "https://x/cancel",
      }),
    );
  });

  it("returns an error (and skips Stripe) when STRIPE_PRICE_ID is missing", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    const { createCheckoutSession } = await import("@/lib/stripe");
    const res = await createCheckoutSession({ successUrl: "https://x/success", cancelUrl: "https://x/cancel" });
    expect(res.ok).toBe(false);
    expect(createMock).not.toHaveBeenCalled();
  });
});

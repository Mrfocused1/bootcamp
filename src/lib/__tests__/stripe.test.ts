import { describe, it, expect, vi, beforeEach } from "vitest";

const { createMock } = vi.hoisted(() => ({ createMock: vi.fn() }));

vi.mock("stripe", () => ({
  default: vi.fn(function () {
    return { checkout: { sessions: { create: createMock } } };
  }),
}));
describe("createCheckoutSession", () => {
  beforeEach(() => {
    vi.resetModules();
    createMock.mockReset();
    delete process.env.STRIPE_PRICE_ID;
    delete process.env.STRIPE_SECRET_KEY;
  });

  it("no-ops in mock mode (no live key) and returns the success url", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: true }));
    // The mock path must only trigger when there is NO live Stripe key.
    delete process.env.STRIPE_SECRET_KEY;
    const { createCheckoutSession } = await import("@/lib/stripe");
    const res = await createCheckoutSession({ successUrl: "https://x/success", cancelUrl: "https://x/cancel" });
    expect(res).toEqual({ ok: true, url: "https://x/success", mocked: true });
    expect(createMock).not.toHaveBeenCalled();
  });

  it("does NOT mock when a live STRIPE_SECRET_KEY is present, even if IS_MOCK is true", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: true }));
    process.env.STRIPE_PRICE_ID = "price_123";
    process.env.STRIPE_SECRET_KEY = "sk_live_real";
    createMock.mockResolvedValue({ url: "https://checkout.stripe.com/c/sess_live" });
    const { createCheckoutSession } = await import("@/lib/stripe");
    const res = await createCheckoutSession({ successUrl: "https://x/success", cancelUrl: "https://x/cancel" });
    expect(res).toEqual({ ok: true, url: "https://checkout.stripe.com/c/sess_live" });
    expect(res.mocked).toBeUndefined();
    expect(createMock).toHaveBeenCalledTimes(1);
  });

  it("creates a Checkout Session and returns its url in real mode", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    process.env.STRIPE_PRICE_ID = "price_123";
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
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

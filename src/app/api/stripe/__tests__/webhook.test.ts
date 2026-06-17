import { describe, it, expect, vi, beforeEach } from "vitest";

const { constructEventMock, sendMock } = vi.hoisted(() => ({
  constructEventMock: vi.fn(),
  sendMock: vi.fn(),
}));
vi.mock("stripe", () => ({
  default: vi.fn(function () { return { webhooks: { constructEvent: constructEventMock } }; }),
}));
vi.mock("@/lib/email", () => ({ sendEmail: sendMock }));

function req(body = "{}") {
  return new Request("https://x/api/stripe/webhook", {
    method: "POST", body, headers: { "stripe-signature": "sig" },
  });
}

describe("stripe webhook POST", () => {
  beforeEach(() => {
    vi.resetModules();
    constructEventMock.mockReset();
    sendMock.mockReset(); sendMock.mockResolvedValue({ ok: true });
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_x";
  });

  it("emails on checkout.session.completed and returns 200", async () => {
    constructEventMock.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: { amount_total: 100000, currency: "gbp", customer_details: { email: "jane@x.com", name: "Jane" }, id: "cs_1" } },
    });
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(req());
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ replyTo: "jane@x.com" }));
    expect(sendMock.mock.calls[0][0].subject).toContain("1000");
  });

  it("returns 400 on bad signature, no email", async () => {
    constructEventMock.mockImplementation(() => { throw new Error("bad sig"); });
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(req());
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("ignores other event types: 200, no email", async () => {
    constructEventMock.mockReturnValue({ type: "payment_intent.created", data: { object: {} } });
    const { POST } = await import("@/app/api/stripe/webhook/route");
    const res = await POST(req());
    expect(res.status).toBe(200);
    expect(sendMock).not.toHaveBeenCalled();
  });
});

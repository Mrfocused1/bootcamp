import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted so `sendMock` exists when the hoisted vi.mock factory runs.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

// Regular function (not arrow) so Vitest 4's Reflect.construct can `new` it.
vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return { emails: { send: sendMock } };
  }),
}));
vi.mock("@/lib/env.server", () => ({
  getServerEnv: () => ({ RESEND_API_KEY: "re_test", RESEND_FROM: "Test <t@test.dev>" }),
}));

describe("sendEmail", () => {
  beforeEach(() => {
    vi.resetModules();
    sendMock.mockReset();
  });

  it("no-ops in mock mode and never calls Resend", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: true }));
    const { sendEmail } = await import("@/lib/email");
    await expect(sendEmail({ to: "a@b.com", subject: "S", text: "T" })).resolves.toEqual({
      ok: true,
      mocked: true,
    });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("sends via Resend in real mode and returns ok with the id", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });
    const { sendEmail } = await import("@/lib/email");
    const res = await sendEmail({ to: "a@b.com", subject: "S", text: "T" });
    expect(res).toEqual({ ok: true, id: "email_123" });
    expect(sendMock).toHaveBeenCalledWith(
      expect.objectContaining({ from: "Test <t@test.dev>", to: "a@b.com", subject: "S", text: "T" }),
    );
  });

  it("returns { ok:false, error } when Resend reports an error", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    sendMock.mockResolvedValue({ data: null, error: { message: "domain not verified" } });
    const { sendEmail } = await import("@/lib/email");
    await expect(sendEmail({ to: "a@b.com", subject: "S", text: "T" })).resolves.toEqual({
      ok: false,
      error: "domain not verified",
    });
  });
});

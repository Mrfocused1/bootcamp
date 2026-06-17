import { describe, it, expect, vi, beforeEach } from "vitest";

// vi.hoisted so `sendMock` exists when the hoisted vi.mock factory runs.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

// Regular function (not arrow) so Vitest 4's Reflect.construct can `new` it.
vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return { emails: { send: sendMock } };
  }),
}));

describe("sendEmail", () => {
  beforeEach(() => {
    vi.resetModules();
    sendMock.mockReset();
    // sendEmail reads these directly from process.env (no longer via getServerEnv).
    process.env.RESEND_API_KEY = "re_test";
    process.env.RESEND_FROM = "Test <t@test.dev>";
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

  it("returns an error (without throwing) when RESEND_API_KEY is missing", async () => {
    vi.doMock("@/lib/mock", () => ({ IS_MOCK: false }));
    delete process.env.RESEND_API_KEY;
    const { sendEmail } = await import("@/lib/email");
    await expect(sendEmail({ to: "a@b.com", subject: "S", text: "T" })).resolves.toEqual({
      ok: false,
      error: "RESEND_API_KEY missing",
    });
    expect(sendMock).not.toHaveBeenCalled();
  });
});

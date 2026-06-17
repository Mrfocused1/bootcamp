import { describe, it, expect, vi, beforeEach } from "vitest";

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendEmail: sendMock }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((u: string) => { throw new Error(`REDIRECT:${u}`); }),
}));

function fd(obj: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(obj)) f.set(k, v);
  return f;
}

describe("submitContactForm", () => {
  beforeEach(() => { vi.resetModules(); sendMock.mockReset(); sendMock.mockResolvedValue({ ok: true }); });

  it("sends and redirects ?sent=1 on valid input", async () => {
    const { submitContactForm } = await import("@/app/(marketing)/contact/actions");
    await expect(submitContactForm(fd({ name: "Sam", email: "sam@x.com", message: "hi" })))
      .rejects.toThrow("REDIRECT:/contact?sent=1");
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ replyTo: "sam@x.com" }));
  });

  it("redirects ?error= and does not send when email/message missing", async () => {
    const { submitContactForm } = await import("@/app/(marketing)/contact/actions");
    await expect(submitContactForm(fd({ name: "Sam" }))).rejects.toThrow(/REDIRECT:\/contact\?error=/);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("honeypot filled → silently succeeds without sending", async () => {
    const { submitContactForm } = await import("@/app/(marketing)/contact/actions");
    await expect(submitContactForm(fd({ company: "bot", email: "a@b.com", message: "x" })))
      .rejects.toThrow("REDIRECT:/contact?sent=1");
    expect(sendMock).not.toHaveBeenCalled();
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";

const { exchangeMock } = vi.hoisted(() => ({ exchangeMock: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({ auth: { exchangeCodeForSession: exchangeMock } })),
}));

function req(qs: string) {
  return new Request(`https://x.com/auth/callback${qs}`);
}

describe("GET /auth/callback", () => {
  beforeEach(() => { vi.resetModules(); exchangeMock.mockReset(); });

  it("exchanges the code and redirects to /dashboard", async () => {
    exchangeMock.mockResolvedValue({ error: null });
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req("?code=abc"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://x.com/dashboard");
    expect(exchangeMock).toHaveBeenCalledWith("abc");
  });

  it("honours ?next", async () => {
    exchangeMock.mockResolvedValue({ error: null });
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req("?code=abc&next=/schedule"));
    expect(res.headers.get("location")).toBe("https://x.com/schedule");
  });

  it("rejects a protocol-relative ?next (//evil.com) and falls back to /dashboard", async () => {
    exchangeMock.mockResolvedValue({ error: null });
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req("?code=abc&next=//evil.com"));
    expect(res.headers.get("location")).toBe("https://x.com/dashboard");
  });

  it("rejects a backslash ?next (/\\evil.com) and falls back to /dashboard", async () => {
    exchangeMock.mockResolvedValue({ error: null });
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req("?code=abc&next=/%5Cevil.com"));
    expect(res.headers.get("location")).toBe("https://x.com/dashboard");
  });

  it("rejects an absolute-URL ?next (https://evil.com) and falls back to /dashboard", async () => {
    exchangeMock.mockResolvedValue({ error: null });
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req("?code=abc&next=https://evil.com"));
    expect(res.headers.get("location")).toBe("https://x.com/dashboard");
  });

  it("redirects to /login?error=auth when code is missing (no exchange)", async () => {
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req(""));
    expect(res.headers.get("location")).toBe("https://x.com/login?error=auth");
    expect(exchangeMock).not.toHaveBeenCalled();
  });

  it("redirects to /login?error=auth when the exchange fails", async () => {
    exchangeMock.mockResolvedValue({ error: { message: "bad" } });
    const { GET } = await import("@/app/auth/callback/route");
    const res = await GET(req("?code=bad"));
    expect(res.headers.get("location")).toBe("https://x.com/login?error=auth");
  });
});

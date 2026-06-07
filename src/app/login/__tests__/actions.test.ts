import { describe, it, expect, vi, beforeEach } from "vitest";

// Force mock mode so the action never hits Supabase
vi.mock("@/lib/mock", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mock")>("@/lib/mock");
  return { ...actual, IS_MOCK: true };
});

// Capture redirect calls; next/navigation's redirect() throws internally —
// we replace it with a plain vi.fn() that also throws so callers see a throw.
const mockRedirect = vi.fn((path: string): never => {
  throw new Error(`NEXT_REDIRECT:${path}`);
});
vi.mock("next/navigation", () => ({ redirect: mockRedirect }));

describe("signIn server action", () => {
  beforeEach(() => {
    vi.resetModules();
    mockRedirect.mockClear();
    mockRedirect.mockImplementation((path: string): never => {
      throw new Error(`NEXT_REDIRECT:${path}`);
    });
  });

  it("redirects to /dashboard with a valid email in mock mode", async () => {
    const { signIn } = await import("@/app/login/actions");

    const fd = new FormData();
    fd.append("email", "user@example.com");

    await expect(signIn(fd)).rejects.toThrow("NEXT_REDIRECT:/dashboard");
    expect(mockRedirect).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects to /login?error=1 when email is empty", async () => {
    const { signIn } = await import("@/app/login/actions");

    const fd = new FormData();
    fd.append("email", "");

    await expect(signIn(fd)).rejects.toThrow("NEXT_REDIRECT:/login?error=1");
    expect(mockRedirect).toHaveBeenCalledWith("/login?error=1");
  });

  it("redirects to /login?error=1 when email has no @ symbol", async () => {
    const { signIn } = await import("@/app/login/actions");

    const fd = new FormData();
    fd.append("email", "notanemail");

    await expect(signIn(fd)).rejects.toThrow("NEXT_REDIRECT:/login?error=1");
    expect(mockRedirect).toHaveBeenCalledWith("/login?error=1");
  });

  it("redirects to /login?error=1 when email field is missing entirely", async () => {
    const { signIn } = await import("@/app/login/actions");

    const fd = new FormData();

    await expect(signIn(fd)).rejects.toThrow("NEXT_REDIRECT:/login?error=1");
    expect(mockRedirect).toHaveBeenCalledWith("/login?error=1");
  });
});

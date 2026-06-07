import { describe, it, expect, beforeEach, afterEach } from "vitest";

// Server env tests have been moved to env.server.test.ts.
// This file covers getClientEnv (from @/lib/env).

describe("getClientEnv", () => {
  let original: Record<string, string | undefined>;
  const CLIENT_KEYS = [
    "NEXT_PUBLIC_APP_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  ];

  beforeEach(() => {
    original = {};
    for (const key of CLIENT_KEYS) {
      original[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of CLIENT_KEYS) {
      if (original[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original[key];
      }
    }
  });

  it("throws when public vars are missing", async () => {
    const { getClientEnv } = await import("@/lib/env");
    expect(() => getClientEnv()).toThrow();
  });

  it("returns typed object with NEXT_PUBLIC vars", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
    const { getClientEnv } = await import("@/lib/env");
    const env = getClientEnv();
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBe("https://example.supabase.co");
    expect(env.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe("anon-key");
  });
});

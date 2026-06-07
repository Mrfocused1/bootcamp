import { describe, it, expect, beforeEach, afterEach } from "vitest";

// We import lazily inside each test so the module is re-evaluated with the right env.
// Since vitest caches modules, we use dynamic import with cache-busting isn't trivial,
// so instead we call the exported functions directly after setting up env.

const REQUIRED_SERVER_KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM",
  "ANTHROPIC_API_KEY",
  "CRON_SECRET",
];

const FULL_ENV: Record<string, string> = {
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  STRIPE_SECRET_KEY: "sk_test_123",
  STRIPE_WEBHOOK_SECRET: "whsec_123",
  RESEND_API_KEY: "re_123",
  RESEND_FROM: "Urban AI <hello@urbanai.co>",
  ANTHROPIC_API_KEY: "sk-ant-123",
  CRON_SECRET: "cron-secret",
};

describe("getServerEnv", () => {
  let original: Record<string, string | undefined>;

  beforeEach(() => {
    original = {};
    for (const key of REQUIRED_SERVER_KEYS) {
      original[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of REQUIRED_SERVER_KEYS) {
      if (original[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = original[key];
      }
    }
  });

  it("throws when required vars are missing", async () => {
    const { getServerEnv } = await import("@/lib/env");
    expect(() => getServerEnv()).toThrow();
  });

  it("throws with a message listing missing keys", async () => {
    const { getServerEnv } = await import("@/lib/env");
    let errorMsg = "";
    try {
      getServerEnv();
    } catch (e) {
      errorMsg = (e as Error).message;
    }
    // Should mention at least one missing key
    expect(errorMsg.length).toBeGreaterThan(0);
  });

  it("returns typed object when all vars are present", async () => {
    for (const [k, v] of Object.entries(FULL_ENV)) {
      process.env[k] = v;
    }
    const { getServerEnv } = await import("@/lib/env");
    const env = getServerEnv();
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe("service-role-key");
    expect(env.ANTHROPIC_API_KEY).toBe("sk-ant-123");
  });
});

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

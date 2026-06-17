import { describe, it, expect, beforeEach, afterEach } from "vitest";

const REQUIRED_SERVER_KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM",
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
  CRON_SECRET: "cron-secret",
};

describe("getServerEnv (from env.server)", () => {
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
    const { getServerEnv } = await import("@/lib/env.server");
    expect(() => getServerEnv()).toThrow();
  });

  it("throws with a message that names a specific missing key (SUPABASE_SERVICE_ROLE_KEY)", async () => {
    // Set all keys except SUPABASE_SERVICE_ROLE_KEY
    for (const [k, v] of Object.entries(FULL_ENV)) {
      if (k !== "SUPABASE_SERVICE_ROLE_KEY") {
        process.env[k] = v;
      }
    }
    const { getServerEnv } = await import("@/lib/env.server");
    let msg = "";
    try {
      getServerEnv();
    } catch (e) {
      msg = (e as Error).message;
    }
    expect(msg).toMatch(/SUPABASE_SERVICE_ROLE_KEY/);
  });

  it("does not require STRIPE_WEBHOOK_SECRET (it is optional)", async () => {
    for (const [k, v] of Object.entries(FULL_ENV)) process.env[k] = v;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    const { getServerEnv } = await import("@/lib/env.server");
    expect(() => getServerEnv()).not.toThrow();
  });

  it("does not require CRON_SECRET (it is optional)", async () => {
    for (const [k, v] of Object.entries(FULL_ENV)) process.env[k] = v;
    delete process.env.CRON_SECRET;
    const { getServerEnv } = await import("@/lib/env.server");
    expect(() => getServerEnv()).not.toThrow();
  });

  it("returns typed object when all vars are present", async () => {
    for (const [k, v] of Object.entries(FULL_ENV)) {
      process.env[k] = v;
    }
    const { getServerEnv } = await import("@/lib/env.server");
    const env = getServerEnv();
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe("service-role-key");
  });
});

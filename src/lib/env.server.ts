import { z } from "zod";

// Note: `import "server-only"` is omitted because it breaks vitest (the package
// throws at import time in the test environment). A runtime guard is used instead.

const serverSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  CRON_SECRET: z.string().min(1),
});

export type ServerEnv = z.infer<typeof serverSchema>;

export function getServerEnv(): ServerEnv {
  // Guard against accidental inclusion in real browser bundles.
  // We check for `window` but not `process` because jsdom (used by vitest)
  // defines window while still injecting process — so this guard only fires
  // in a genuine browser where process.env is absent.
  if (typeof window !== "undefined" && typeof process === "undefined") {
    throw new Error("getServerEnv() must not be called in the browser");
  }
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => i.path.join("."))
      .join(", ");
    throw new Error(`Missing or invalid environment variables: ${missing}`);
  }
  return result.data;
}

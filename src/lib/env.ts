import { z } from "zod";

// Re-export server env from env.server for convenience (server-side imports only).
export { getServerEnv, type ServerEnv } from "@/lib/env.server";

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

export type ClientEnv = z.infer<typeof clientSchema>;

export function getClientEnv(): ClientEnv {
  const result = clientSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => i.path.join("."))
      .join(", ");
    throw new Error(`Missing or invalid environment variables: ${missing}`);
  }
  return result.data;
}

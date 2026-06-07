import { z } from "zod";
import { computeWatched, isComplete } from "@/lib/progress";
import { IS_MOCK } from "@/lib/mock";

const BodySchema = z.union([
  // Shortcut: mark complete immediately (no position/duration required)
  z.object({
    lessonId: z.string().min(1),
    completed: z.literal(true),
  }),
  // Standard: track position within a video
  z.object({
    lessonId: z.string().min(1),
    positionSeconds: z.number().nonnegative(),
    durationSeconds: z.number().positive(),
    completed: z.boolean().optional(),
  }),
]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const { lessonId } = data;

  let watched_percent: number;
  let completed: boolean;

  if ("positionSeconds" in data) {
    watched_percent = computeWatched(data.positionSeconds, data.durationSeconds);
    // Allow explicit `completed: true` override even when position-based
    completed = data.completed === true ? true : isComplete(watched_percent);
  } else {
    // completed: true shortcut — force 100%
    watched_percent = 100;
    completed = true;
  }

  if (IS_MOCK) {
    return Response.json({ ok: true, watched_percent, completed }, { status: 200 });
  }

  // Real mode: upsert into lesson_progress for the current user
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lastPosition =
    "positionSeconds" in data ? data.positionSeconds : undefined;

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      ...(lastPosition !== undefined && { last_position_seconds: lastPosition }),
      watched_percent,
      completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true, watched_percent, completed }, { status: 200 });
}

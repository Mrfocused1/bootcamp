import { z } from "zod";
import { computeWatched, isComplete } from "@/lib/progress";
import { IS_MOCK } from "@/lib/mock";

const BodySchema = z.object({
  lessonId: z.string().min(1),
  positionSeconds: z.number().nonnegative(),
  durationSeconds: z.number().positive(),
});

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

  const { lessonId, positionSeconds, durationSeconds } = parsed.data;
  const watched_percent = computeWatched(positionSeconds, durationSeconds);
  const completed = isComplete(watched_percent);

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

  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      last_position_seconds: positionSeconds,
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

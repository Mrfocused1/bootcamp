import { IS_MOCK } from "@/lib/mock";

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD
const TIME_RE = /^\d{2}:\d{2}$/; // HH:MM

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { start_date, daily_time } = (body ?? {}) as {
    start_date?: unknown;
    daily_time?: unknown;
  };

  if (
    typeof start_date !== "string" ||
    !DATE_RE.test(start_date) ||
    typeof daily_time !== "string" ||
    !TIME_RE.test(daily_time)
  ) {
    return Response.json({ ok: false, error: "Invalid booking" }, { status: 400 });
  }

  if (IS_MOCK) {
    return Response.json({ ok: true, mocked: true }, { status: 200 });
  }

  // Real mode: upsert the student's single schedule, scoped to them via RLS.
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // Attach to the student's most-recent active enrollment cohort (optional).
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("cohort_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const cohort_id = (enrollment?.cohort_id as string | undefined) ?? null;

  const { error } = await supabase.from("bookings").upsert(
    {
      user_id: user.id,
      cohort_id,
      start_date,
      daily_time,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true }, { status: 200 });
}

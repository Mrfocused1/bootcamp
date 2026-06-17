"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/queries";
import { isAdmin } from "@/lib/admin";
import { IS_MOCK } from "@/lib/mock";

async function guardAdmin(): Promise<void> {
  const profile = await getCurrentProfile();
  if (!isAdmin(profile)) {
    throw new Error("Forbidden");
  }
}

function str(formData: FormData, key: string): string | null {
  const v = formData.get(key);
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t === "" ? null : t;
}

/** datetime-local / date input → ISO string (or null). */
function toIso(formData: FormData, key: string): string | null {
  const v = str(formData, key);
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export async function saveLesson(formData: FormData): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/content");
    return;
  }

  const id = str(formData, "id");
  if (!id) {
    revalidatePath("/admin/content");
    return;
  }
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await supabase
    .from("lessons")
    .update({
      title: str(formData, "title") ?? "Untitled lesson",
      video_provider: str(formData, "video_provider"),
      video_id: str(formData, "video_id"),
    })
    .eq("id", id);
  revalidatePath("/admin/content");
}

export async function setAccess(
  userId: string,
  status: "active" | "revoked"
): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/students");
    return;
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  // Single-cohort product: a student has one active enrollment, so filtering by
  // user_id flips their access. Revisit if multi-cohort enrollment is added.
  await supabase.from("enrollments").update({ status }).eq("user_id", userId);
  revalidatePath("/admin/students");
}

export async function saveCohort(formData: FormData): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/cohorts");
    return;
  }

  const startDate = str(formData, "start_date");
  if (!startDate) {
    revalidatePath("/admin/cohorts");
    return;
  }
  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await supabase.from("cohorts").insert({
    name: str(formData, "name") ?? "Untitled cohort",
    start_date: startDate,
  });
  revalidatePath("/admin/cohorts");
}

export async function saveLiveSession(formData: FormData): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/cohorts");
    return;
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  // The form has no cohort field; attach the session to the most recent cohort.
  const { data: cohort } = await supabase
    .from("cohorts")
    .select("id")
    .order("start_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  const scheduledAt = toIso(formData, "scheduled_at");
  if (!cohort || !scheduledAt) {
    revalidatePath("/admin/cohorts");
    return;
  }
  await supabase.from("live_sessions").insert({
    cohort_id: (cohort as { id: string }).id,
    day_index: Number(str(formData, "day_index") ?? "1") || 1,
    scheduled_at: scheduledAt,
    zoom_url: str(formData, "zoom_url"),
  });
  revalidatePath("/admin/cohorts");
}

export async function postAnnouncement(formData: FormData): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/announcements");
    return;
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  await supabase.from("announcements").insert({
    title: str(formData, "title") ?? "Announcement",
    body: str(formData, "body"),
  });
  revalidatePath("/admin/announcements");
}

// ---------------------------------------------------------------------------
// Feature 3 — Analytics: nudge an at-risk student
// ---------------------------------------------------------------------------
export async function nudgeStudent(userId: string): Promise<{ ok: boolean }> {
  await guardAdmin();

  if (IS_MOCK) {
    // No-op in mock mode
    return { ok: true };
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", userId)
    .maybeSingle();
  const profile = data as { name: string | null; email: string | null } | null;
  if (!profile?.email) return { ok: false };

  const { sendEmail } = await import("@/lib/email");
  const res = await sendEmail({
    to: profile.email,
    subject: "Your Bridgeway AI Bootcamp is waiting",
    text:
      `Hi ${profile.name ?? "there"},\n\n` +
      `Just a quick nudge — you've still got lessons to finish in your AI bootcamp. ` +
      `Pick up where you left off whenever you have 20 minutes; small steps add up fast.\n\n` +
      `Log back in: https://www.bridgewayaibootcamp.com/dashboard\n\n` +
      `You've got this,\nThe Bridgeway team`,
  });
  return { ok: res.ok };
}

/** Void wrapper for use as a form action. */
export async function nudgeStudentAction(userId: string): Promise<void> {
  await nudgeStudent(userId);
}

// ---------------------------------------------------------------------------
// Feature 4 — Broadcast email composer
// ---------------------------------------------------------------------------
export async function sendBroadcast(
  formData: FormData
): Promise<{ ok: boolean; recipients: number }> {
  await guardAdmin();

  if (IS_MOCK) {
    // In mock mode return a fixed mock recipient count
    return { ok: true, recipients: 20 };
  }

  const recipientType = str(formData, "recipient_type") ?? "all";
  const cohortId = str(formData, "cohort");
  const subject = str(formData, "subject") ?? "Update from Bridgeway AI Bootcamp";
  const body = str(formData, "body") ?? "";

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  let query = supabase
    .from("enrollments")
    .select("profiles(email)")
    .eq("status", "active");
  if (recipientType === "cohort") {
    // "Specific cohort" chosen but none selected → refuse rather than fan out to everyone.
    if (!cohortId) return { ok: false, recipients: 0 };
    query = query.eq("cohort_id", cohortId);
  }
  const { data } = await query;
  // PostgREST returns the to-one `profiles` relation as a single object at
  // runtime; the generated types widen it to an array, so cast via unknown.
  const emails = ((data ?? []) as unknown as { profiles: { email: string | null } | null }[])
    .map((r) => r.profiles?.email)
    .filter((e): e is string => !!e);

  const { sendEmail } = await import("@/lib/email");
  const results = await Promise.all(emails.map((to) => sendEmail({ to, subject, text: body })));
  // Report delivered count (sendEmail never throws; failures return { ok:false }).
  return { ok: true, recipients: results.filter((r) => r.ok).length };
}

// ---------------------------------------------------------------------------
// Feature 5 — Admin reply to AI Q&A question
// ---------------------------------------------------------------------------
export async function replyToQuestion(
  messageId: string,
  formData: FormData
): Promise<{ ok: boolean }> {
  await guardAdmin();

  if (IS_MOCK) {
    // No-op in mock mode
    return { ok: true };
  }

  // Real-mode stub — insert admin reply and optionally email the student:
  // const reply = formData.get("reply") as string;
  // const { createClient } = await import("@/lib/supabase/admin");
  // const supabase = createClient();
  // await supabase.from("ai_messages").insert({
  //   parent_id: messageId,
  //   role: "admin",
  //   content: reply,
  // });
  // Optionally email student via Resend
  void messageId;
  void formData;
  return { ok: true };
}

/** Void wrapper for use as a form action. */
export async function replyToQuestionAction(
  messageId: string,
  formData: FormData
): Promise<void> {
  await replyToQuestion(messageId, formData);
}

// ---------------------------------------------------------------------------
// Feature 5 — Mark Q&A question as resolved
// ---------------------------------------------------------------------------
export async function markResolved(messageId: string): Promise<{ ok: boolean }> {
  await guardAdmin();

  if (IS_MOCK) {
    return { ok: true };
  }

  // Real-mode stub:
  // const { createClient } = await import("@/lib/supabase/admin");
  // const supabase = createClient();
  // await supabase.from("ai_messages").update({ resolved: true }).eq("id", messageId);
  void messageId;
  return { ok: true };
}

/** Void wrapper for use as a form action. */
export async function markResolvedAction(messageId: string): Promise<void> {
  await markResolved(messageId);
}

// ---------------------------------------------------------------------------
// Session recordings (Cloudflare R2)
// ---------------------------------------------------------------------------

/** Step 1: get a short-lived URL the browser uploads the file straight to R2. */
export async function createRecordingUploadUrl(input: {
  cohortId: string;
  dayIndex: number;
  fileName: string;
  contentType: string;
}): Promise<{ ok: boolean; uploadUrl?: string; key?: string; mock?: boolean; error?: string }> {
  await guardAdmin();

  if (IS_MOCK) {
    // No R2 in mock mode — skip the upload; confirmRecording will no-op too.
    return { ok: true, mock: true, key: "mock" };
  }

  try {
    const { presignUpload, recordingKey, isR2Configured } = await import("@/lib/r2");
    if (!isR2Configured()) {
      return { ok: false, error: "Cloudflare R2 is not configured yet (set the R2_* env vars)." };
    }
    const key = recordingKey(input.cohortId, input.dayIndex, input.fileName);
    const uploadUrl = await presignUpload(key, input.contentType);
    return { ok: true, uploadUrl, key };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Step 2: once the file is in R2, save the recording row. */
export async function confirmRecording(input: {
  cohortId: string;
  dayIndex: number;
  title: string;
  key: string;
  durationSeconds: number;
}): Promise<{ ok: boolean; error?: string }> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/recordings");
    return { ok: true };
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { error } = await supabase.from("session_recordings").insert({
      cohort_id: input.cohortId,
      day_index: input.dayIndex,
      title: input.title,
      object_key: input.key,
      duration_seconds: Math.round(input.durationSeconds || 0),
    });
    if (error) return { ok: false, error: error.message };
    revalidatePath("/admin/recordings");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

/** Delete a recording (DB row + the R2 object). */
export async function deleteRecordingAction(id: string): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/recordings");
    return;
  }

  const { createAdminClient } = await import("@/lib/supabase/admin");
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("session_recordings")
    .select("object_key")
    .eq("id", id)
    .single();
  if (data?.object_key) {
    try {
      const { deleteObject } = await import("@/lib/r2");
      await deleteObject(data.object_key as string);
    } catch {
      // best-effort object delete; still remove the row
    }
  }
  await supabase.from("session_recordings").delete().eq("id", id);
  revalidatePath("/admin/recordings");
}

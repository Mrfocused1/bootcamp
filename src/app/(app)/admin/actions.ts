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

export async function saveLesson(formData: FormData): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/content");
    return;
  }

  // Supabase write stub (non-mock path — not active without env vars):
  // const { id, title, video_provider, video_id } = Object.fromEntries(formData);
  // const { createClient } = await import("@/lib/supabase/admin");
  // const supabase = createClient();
  // await supabase.from("lessons").update({ title, video_provider, video_id }).eq("id", id);
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

  // Supabase write stub:
  // const { createClient } = await import("@/lib/supabase/admin");
  // const supabase = createClient();
  // await supabase.from("profiles").update({ access_status: status }).eq("id", userId);
  revalidatePath("/admin/students");
}

export async function saveCohort(formData: FormData): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/cohorts");
    return;
  }

  // Supabase write stub:
  // const { name, start_date } = Object.fromEntries(formData);
  // const { createClient } = await import("@/lib/supabase/admin");
  // const supabase = createClient();
  // await supabase.from("cohorts").insert({ name, start_date });
  revalidatePath("/admin/cohorts");
}

export async function saveLiveSession(formData: FormData): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/cohorts");
    return;
  }

  // Supabase write stub:
  // const { day_index, scheduled_at, zoom_url } = Object.fromEntries(formData);
  // const { createClient } = await import("@/lib/supabase/admin");
  // const supabase = createClient();
  // await supabase.from("live_sessions").insert({ day_index: Number(day_index), scheduled_at, zoom_url });
  revalidatePath("/admin/cohorts");
}

export async function postAnnouncement(formData: FormData): Promise<void> {
  await guardAdmin();

  if (IS_MOCK) {
    revalidatePath("/admin/announcements");
    return;
  }

  // Supabase write stub:
  // const { title, body } = Object.fromEntries(formData);
  // const { createClient } = await import("@/lib/supabase/admin");
  // const supabase = createClient();
  // await supabase.from("announcements").insert({ title, body });
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

  // Real-mode stub — e.g. send a nudge email via Resend:
  // const { sendEmail } = await import("@/lib/email");
  // await sendEmail({ to: userEmail, subject: "Keep going!", body: "..." });
  return { ok: true };
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

  // Real-mode stub — fetch recipients and send via Resend:
  // const cohortId = formData.get("cohort") as string | null;
  // const subject = formData.get("subject") as string;
  // const body = formData.get("body") as string;
  // const { createClient } = await import("@/lib/supabase/admin");
  // const supabase = createClient();
  // let query = supabase.from("profiles").select("email").eq("role", "student");
  // if (cohortId) query = query.eq("cohort_id", cohortId);
  // const { data: profiles } = await query;
  // const emails = (profiles ?? []).map((p: { email: string }) => p.email);
  // const { sendBulkEmail } = await import("@/lib/email");
  // await sendBulkEmail({ to: emails, subject, body });
  // return { ok: true, recipients: emails.length };
  return { ok: true, recipients: 0 };
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

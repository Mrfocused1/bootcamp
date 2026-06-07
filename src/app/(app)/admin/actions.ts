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

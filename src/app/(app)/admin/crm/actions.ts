"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries";
import { isAdmin, isOwner } from "@/lib/admin";
import { IS_MOCK } from "@/lib/mock";
import type { Profile } from "@/lib/types";

async function guardCrm(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!isAdmin(profile)) throw new Error("Forbidden");
  return profile;
}

async function guardOwner(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!isOwner(profile)) throw new Error("Forbidden — owners only");
  return profile;
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

// ---------------------------------------------------------------------------
// Create a lead
// ---------------------------------------------------------------------------
export async function createLead(formData: FormData): Promise<void> {
  const profile = await guardCrm();

  if (IS_MOCK) {
    revalidatePath("/admin/crm/leads");
    redirect("/admin/crm/leads?created=1");
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const payload = {
    company: str(formData, "company") ?? "Untitled lead",
    website: str(formData, "website"),
    contact_name: str(formData, "contact_name"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    status: str(formData, "status") ?? "new",
    source: str(formData, "source") ?? "other",
    priority: str(formData, "priority") ?? "medium",
    est_value: Number(str(formData, "est_value") ?? "0") || 0,
    assigned_to: str(formData, "assigned_to") ?? profile.id,
    created_by: profile.id,
    notes: str(formData, "notes"),
    next_follow_up_at: toIso(formData, "next_follow_up_at"),
  };
  const { data, error } = await supabase.from("leads").insert(payload).select("id").single();
  if (error) {
    // 23505 = unique violation → this website/email is already a logged lead.
    const msg =
      error.code === "23505"
        ? "A lead with this website or email already exists — search for it so the team doesn't double-contact them."
        : error.message;
    redirect(`/admin/crm/leads/new?error=${encodeURIComponent(msg)}`);
  }
  revalidatePath("/admin/crm");
  revalidatePath("/admin/crm/leads");
  redirect(`/admin/crm/leads/${(data as { id: string }).id}`);
}

// ---------------------------------------------------------------------------
// Update a lead (full edit)
// ---------------------------------------------------------------------------
export async function updateLead(formData: FormData): Promise<void> {
  await guardCrm();
  const id = str(formData, "id");
  if (!id) throw new Error("Missing lead id");

  if (IS_MOCK) {
    revalidatePath(`/admin/crm/leads/${id}`);
    redirect(`/admin/crm/leads/${id}?saved=1`);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      company: str(formData, "company") ?? "Untitled lead",
      website: str(formData, "website"),
      contact_name: str(formData, "contact_name"),
      email: str(formData, "email"),
      phone: str(formData, "phone"),
      status: str(formData, "status") ?? "new",
      source: str(formData, "source") ?? "other",
      priority: str(formData, "priority") ?? "medium",
      est_value: Number(str(formData, "est_value") ?? "0") || 0,
      assigned_to: str(formData, "assigned_to"),
      notes: str(formData, "notes"),
      next_follow_up_at: toIso(formData, "next_follow_up_at"),
    })
    .eq("id", id);
  if (error) {
    redirect(`/admin/crm/leads/${id}?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/admin/crm");
  revalidatePath("/admin/crm/leads");
  revalidatePath(`/admin/crm/leads/${id}`);
  redirect(`/admin/crm/leads/${id}?saved=1`);
}

// ---------------------------------------------------------------------------
// Quick status change (pipeline move)
// ---------------------------------------------------------------------------
export async function updateLeadStatus(formData: FormData): Promise<void> {
  await guardCrm();
  const id = str(formData, "id");
  const status = str(formData, "status");
  if (!id || !status) throw new Error("Missing id/status");

  if (!IS_MOCK) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) {
      redirect(`/admin/crm/leads/${id}?error=${encodeURIComponent(error.message)}`);
    }
  }
  revalidatePath("/admin/crm");
  revalidatePath("/admin/crm/leads");
  revalidatePath(`/admin/crm/leads/${id}`);
  redirect(`/admin/crm/leads/${id}?saved=1`);
}

// ---------------------------------------------------------------------------
// Reassign a lead to a team member
// ---------------------------------------------------------------------------
export async function assignLead(formData: FormData): Promise<void> {
  await guardCrm();
  const id = str(formData, "id");
  const assignedTo = str(formData, "assigned_to");
  if (!id) throw new Error("Missing id");

  if (!IS_MOCK) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.from("leads").update({ assigned_to: assignedTo }).eq("id", id);
    if (error) {
      redirect(`/admin/crm/leads/${id}?error=${encodeURIComponent(error.message)}`);
    }
  }
  revalidatePath(`/admin/crm/leads/${id}`);
  redirect(`/admin/crm/leads/${id}?saved=1`);
}

// ---------------------------------------------------------------------------
// Log an outreach activity (+ optional follow-up). Updates the lead's
// last_contacted_at / next_follow_up_at so the team never double-contacts.
// ---------------------------------------------------------------------------
export async function logActivity(formData: FormData): Promise<void> {
  const profile = await guardCrm();
  const leadId = str(formData, "lead_id");
  if (!leadId) throw new Error("Missing lead id");

  if (IS_MOCK) {
    revalidatePath(`/admin/crm/leads/${leadId}`);
    redirect(`/admin/crm/leads/${leadId}?logged=1`);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const type = str(formData, "type") ?? "note";
  const occurredAt = toIso(formData, "occurred_at") ?? new Date().toISOString();
  const followUpAt = toIso(formData, "follow_up_at");

  const { error: activityError } = await supabase.from("lead_activities").insert({
    lead_id: leadId,
    user_id: profile.id,
    type,
    direction: str(formData, "direction") ?? "outbound",
    outcome: str(formData, "outcome"),
    notes: str(formData, "notes"),
    occurred_at: occurredAt,
    follow_up_at: followUpAt,
  });
  if (activityError) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent(activityError.message)}`);
  }

  // Sync the lead: bump last_contacted (unless it's just a note), set next follow-up.
  const leadPatch: Record<string, unknown> = { next_follow_up_at: followUpAt };
  if (type !== "note") leadPatch.last_contacted_at = occurredAt;
  const { error: leadError } = await supabase.from("leads").update(leadPatch).eq("id", leadId);
  if (leadError) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent(leadError.message)}`);
  }

  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/leads/${leadId}`);
  redirect(`/admin/crm/leads/${leadId}?logged=1`);
}

// ---------------------------------------------------------------------------
// Clear a lead's follow-up (mark handled)
// ---------------------------------------------------------------------------
export async function clearFollowUp(formData: FormData): Promise<void> {
  await guardCrm();
  const id = str(formData, "id");
  if (!id) throw new Error("Missing id");
  if (!IS_MOCK) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.from("leads").update({ next_follow_up_at: null }).eq("id", id);
    if (error) {
      redirect(`/admin/crm/leads/${id}?error=${encodeURIComponent(error.message)}`);
    }
  }
  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/leads/${id}`);
  redirect("/admin/crm?done=1");
}

// ---------------------------------------------------------------------------
// Delete a lead (owners only)
// ---------------------------------------------------------------------------
export async function deleteLead(formData: FormData): Promise<void> {
  await guardOwner();
  const id = str(formData, "id");
  if (!id) throw new Error("Missing id");
  if (!IS_MOCK) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      redirect(`/admin/crm/leads?error=${encodeURIComponent(error.message)}`);
    }
  }
  revalidatePath("/admin/crm");
  revalidatePath("/admin/crm/leads");
  redirect("/admin/crm/leads?deleted=1");
}

// ---------------------------------------------------------------------------
// Send an outreach email to a lead (via Resend) and log it as an activity.
// ---------------------------------------------------------------------------
export async function sendLeadEmail(formData: FormData): Promise<void> {
  const profile = await guardCrm();
  const leadId = str(formData, "lead_id");
  if (!leadId) throw new Error("Missing lead id");

  const subject = str(formData, "subject");
  const body = str(formData, "body");
  if (!subject || !body) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent("Subject and message are required")}`);
  }
  const followUpAt = toIso(formData, "follow_up_at");

  if (IS_MOCK) {
    revalidatePath(`/admin/crm/leads/${leadId}`);
    redirect(`/admin/crm/leads/${leadId}?sent=1`);
  }

  const { getLeadById } = await import("@/lib/crm");
  const lead = await getLeadById(leadId);
  if (!lead || !lead.email) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent("This lead has no email address")}`);
  }

  const { sendEmail } = await import("@/lib/email");
  const res = await sendEmail({ to: lead.email, subject, text: body });
  if (!res.ok) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent(res.error ?? "Send failed")}`);
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { error: activityError } = await supabase.from("lead_activities").insert({
    lead_id: leadId,
    user_id: profile.id,
    type: "email",
    direction: "outbound",
    outcome: "no_response",
    notes: subject,
    occurred_at: now,
    follow_up_at: followUpAt,
  });
  if (activityError) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent(activityError.message)}`);
  }
  const { error: leadError } = await supabase
    .from("leads")
    .update({ last_contacted_at: now, next_follow_up_at: followUpAt })
    .eq("id", leadId);
  if (leadError) {
    redirect(`/admin/crm/leads/${leadId}?error=${encodeURIComponent(leadError.message)}`);
  }

  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/leads/${leadId}`);
  redirect(`/admin/crm/leads/${leadId}?sent=1`);
}

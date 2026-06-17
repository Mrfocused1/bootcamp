export type Role = "student" | "admin";

/** CRM access level. owner = co-owner (full pipeline + analytics); staff = employee. */
export type CrmRole = "owner" | "staff";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export type LeadSource =
  | "referral"
  | "cold_outreach"
  | "inbound"
  | "social"
  | "event"
  | "other";

export type LeadPriority = "low" | "medium" | "high";

export type ActivityType =
  | "call"
  | "email"
  | "meeting"
  | "linkedin"
  | "sms"
  | "note";

export type ActivityDirection = "outbound" | "inbound";

export type ActivityOutcome =
  | "connected"
  | "no_answer"
  | "voicemail"
  | "replied"
  | "bounced"
  | "meeting_booked"
  | "interested"
  | "not_interested"
  | "no_response";

/** A potential client in the sales pipeline. */
export interface Lead {
  id: string;
  company: string;
  website: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  est_value: number;
  assigned_to: string | null; // profile id
  created_by: string | null; // profile id
  notes: string | null;
  next_follow_up_at: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

/** One logged outreach / follow-up against a lead. */
export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id: string | null;
  type: ActivityType;
  direction: ActivityDirection;
  outcome: ActivityOutcome | null;
  notes: string | null;
  occurred_at: string;
  follow_up_at: string | null;
  created_at: string;
}

/** A CRM team member (subset of Profile used across the CRM UI). */
export interface CrmMember {
  id: string;
  name: string;
  email: string;
  crm_role: CrmRole;
}

export interface Chapter {
  title: string;
  start_seconds: number;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: Role;
  crm_role?: CrmRole | null;
}

export interface Cohort {
  id: string;
  name: string;
  start_date: string; // 'YYYY-MM-DD'
}

export interface Day {
  id: string;
  day_index: number;
  title: string;
  description: string;
}

export interface Lesson {
  id: string;
  day_id: string;
  day_index: number;
  title: string;
  video_provider: string | null;
  video_id: string | null;
  duration_seconds: number;
  resources: { label: string; url: string }[];
  topics: string[];
  chapters: Chapter[];
  order: number;
}

export interface Progress {
  lesson_id: string;
  last_position_seconds: number;
  watched_percent: number;
  completed: boolean;
}

export interface LiveSession {
  id: string;
  day_index: number;
  scheduled_at: string;
  zoom_url: string;
}

export interface SessionRecording {
  id: string;
  cohort_id: string;
  day_index: number;
  title: string;
  object_key: string;
  duration_seconds: number;
  recorded_at: string;
}

/** A recording with a ready-to-play URL (signed in prod, sample in mock). */
export interface PlayableRecording {
  id: string;
  day_index: number;
  title: string;
  url: string;
  duration_seconds: number;
  recorded_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export interface StudentSummary {
  profile: Profile;
  cohort: Cohort;
  overallPercent: number;
}

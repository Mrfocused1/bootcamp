import type {
  LeadStatus,
  LeadSource,
  LeadPriority,
  ActivityType,
  ActivityOutcome,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Pipeline stages — ordered, with a brand colour for badges + the board.
// ---------------------------------------------------------------------------
export interface StatusMeta {
  value: LeadStatus;
  label: string;
  /** tailwind bg + text used for the badge / board column header */
  badge: string;
  /** soft background for the board column body */
  soft: string;
  open: boolean; // counts toward the active pipeline?
}

export const STATUS_META: Record<LeadStatus, StatusMeta> = {
  new: { value: "new", label: "New", badge: "bg-ua-sky text-ua-ink", soft: "bg-ua-sky/15", open: true },
  contacted: { value: "contacted", label: "Contacted", badge: "bg-ua-blue text-white", soft: "bg-ua-blue/10", open: true },
  qualified: { value: "qualified", label: "Qualified", badge: "bg-ua-pink text-ua-ink", soft: "bg-ua-pink/20", open: true },
  proposal: { value: "proposal", label: "Proposal", badge: "bg-ua-orange text-white", soft: "bg-ua-orange/15", open: true },
  won: { value: "won", label: "Won", badge: "bg-ua-green text-ua-ink", soft: "bg-ua-green/25", open: false },
  lost: { value: "lost", label: "Lost", badge: "bg-ua-ink/15 text-ua-ink/70", soft: "bg-ua-ink/5", open: false },
};

/** Pipeline order for the board + funnel. */
export const STATUS_ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];

export const SOURCE_LABELS: Record<LeadSource, string> = {
  referral: "Referral",
  cold_outreach: "Cold outreach",
  inbound: "Inbound enquiry",
  social: "Social media",
  event: "Event / networking",
  other: "Other",
};

export const SOURCE_ORDER: LeadSource[] = [
  "referral",
  "cold_outreach",
  "inbound",
  "social",
  "event",
  "other",
];

export interface PriorityMeta {
  value: LeadPriority;
  label: string;
  badge: string;
}

export const PRIORITY_META: Record<LeadPriority, PriorityMeta> = {
  high: { value: "high", label: "High", badge: "bg-ua-orange/20 text-ua-orange" },
  medium: { value: "medium", label: "Medium", badge: "bg-ua-sky/25 text-ua-blue" },
  low: { value: "low", label: "Low", badge: "bg-ua-ink/10 text-ua-ink/60" },
};

export const PRIORITY_ORDER: LeadPriority[] = ["high", "medium", "low"];

// ---------------------------------------------------------------------------
// Outreach activity types + outcomes
// ---------------------------------------------------------------------------
export interface ActivityTypeMeta {
  value: ActivityType;
  label: string;
  /** emoji glyph used inline in the timeline */
  glyph: string;
  /** does this activity count as "contacting" the lead? (note does not) */
  contact: boolean;
}

export const ACTIVITY_TYPE_META: Record<ActivityType, ActivityTypeMeta> = {
  call: { value: "call", label: "Call", glyph: "📞", contact: true },
  email: { value: "email", label: "Email", glyph: "✉️", contact: true },
  meeting: { value: "meeting", label: "Meeting", glyph: "🤝", contact: true },
  linkedin: { value: "linkedin", label: "LinkedIn", glyph: "in", contact: true },
  sms: { value: "sms", label: "Text / WhatsApp", glyph: "💬", contact: true },
  note: { value: "note", label: "Note", glyph: "📝", contact: false },
};

export const ACTIVITY_TYPE_ORDER: ActivityType[] = [
  "call",
  "email",
  "meeting",
  "linkedin",
  "sms",
  "note",
];

export const OUTCOME_LABELS: Record<ActivityOutcome, string> = {
  connected: "Connected / spoke",
  no_answer: "No answer",
  voicemail: "Left voicemail",
  replied: "Replied",
  bounced: "Bounced / wrong contact",
  meeting_booked: "Meeting booked",
  interested: "Interested",
  not_interested: "Not interested",
  no_response: "No response yet",
};

export const OUTCOME_ORDER: ActivityOutcome[] = [
  "connected",
  "replied",
  "interested",
  "meeting_booked",
  "voicemail",
  "no_answer",
  "no_response",
  "not_interested",
  "bounced",
];

/** Outcomes that read as a positive signal (for analytics). */
export const POSITIVE_OUTCOMES: ActivityOutcome[] = [
  "connected",
  "replied",
  "interested",
  "meeting_booked",
];

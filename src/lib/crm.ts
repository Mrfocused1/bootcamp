import type {
  Lead,
  LeadActivity,
  LeadStatus,
  LeadPriority,
  CrmMember,
} from "@/lib/types";
import { IS_MOCK } from "@/lib/mock";
import { POSITIVE_OUTCOMES, ACTIVITY_TYPE_META } from "@/lib/crm-constants";

// ===========================================================================
// Mock fixtures — a populated pipeline so the CRM renders fully in local
// (mock) mode for review. Dates are relative to "now" so follow-ups land in
// realistic overdue / today / upcoming buckets.
// ===========================================================================
function rel(days: number, hour = 10, min = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

const MOCK_TEAM: CrmMember[] = [
  { id: "crm-owner-1", name: "Paul Bridges", email: "paul@bridgewayaibootcamp.com", crm_role: "owner" },
  { id: "crm-owner-2", name: "Maya Bridges", email: "maya@bridgewayaibootcamp.com", crm_role: "owner" },
  { id: "crm-staff", name: "Jamie Okafor", email: "jamie@bridgewayaibootcamp.com", crm_role: "staff" },
];

const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1", company: "Northside Boxing Club", website: "https://northsideboxing.co.uk",
    contact_name: "Dwayne Carter", email: "dwayne@northsideboxing.co.uk", phone: "+44 7700 900111",
    status: "contacted", source: "cold_outreach", priority: "high", est_value: 2500,
    assigned_to: "crm-staff", created_by: "crm-staff",
    notes: "Wants a site to fill class slots + sell memberships online. Loved the Chuks Fitness build.",
    next_follow_up_at: rel(0, 14), last_contacted_at: rel(-2, 11), created_at: rel(-9), updated_at: rel(-2),
  },
  {
    id: "lead-2", company: "Bright Beginnings Nursery", website: "https://brightbeginnings-nursery.co.uk",
    contact_name: "Priya Shah", email: "hello@brightbeginnings-nursery.co.uk", phone: "+44 7700 900222",
    status: "qualified", source: "inbound", priority: "medium", est_value: 3200,
    assigned_to: "crm-owner-1", created_by: "crm-owner-1",
    notes: "Enquiry via contact form. Needs gallery, waitlist form and Ofsted page.",
    next_follow_up_at: rel(2, 10), last_contacted_at: rel(-1, 16), created_at: rel(-6), updated_at: rel(-1),
  },
  {
    id: "lead-3", company: "Vale Driving School", website: "https://valedrivingschool.co.uk",
    contact_name: "Tom Reeves", email: "tom@valedrivingschool.co.uk", phone: "+44 7700 900333",
    status: "new", source: "referral", priority: "medium", est_value: 1800,
    assigned_to: "crm-staff", created_by: "crm-owner-2",
    notes: "Referred by Clearway. Booking + instructor profiles like the Clearway site.",
    next_follow_up_at: rel(1, 9), last_contacted_at: null, created_at: rel(-1), updated_at: rel(-1),
  },
  {
    id: "lead-4", company: "Harmony Wellness Clinic", website: "https://harmonywellnessclinic.co.uk",
    contact_name: "Dr. Aisha Bello", email: "aisha@harmonywellness.co.uk", phone: "+44 7700 900444",
    status: "proposal", source: "social", priority: "high", est_value: 4500,
    assigned_to: "crm-owner-2", created_by: "crm-owner-2",
    notes: "Proposal sent for a 6-page site + online booking integration. Decision by end of month.",
    next_follow_up_at: rel(-1, 11), last_contacted_at: rel(-3, 15), created_at: rel(-12), updated_at: rel(-3),
  },
  {
    id: "lead-5", company: "The Daily Grind Café", website: "https://dailygrindcafe.co.uk",
    contact_name: "Leah Morgan", email: "leah@dailygrindcafe.co.uk", phone: "+44 7700 900555",
    status: "contacted", source: "cold_outreach", priority: "low", est_value: 1500,
    assigned_to: "crm-staff", created_by: "crm-staff",
    notes: "Small one-pager + menu. Price sensitive — pitched the lite package.",
    next_follow_up_at: rel(3, 11), last_contacted_at: rel(-2, 9), created_at: rel(-5), updated_at: rel(-2),
  },
  {
    id: "lead-6", company: "Lighthouse Youth Trust", website: "https://lighthouseyouthtrust.org.uk",
    contact_name: "Marcus Cole", email: "marcus@lighthouseyouth.org.uk", phone: "+44 7700 900666",
    status: "won", source: "referral", priority: "high", est_value: 3800,
    assigned_to: "crm-owner-1", created_by: "crm-owner-1",
    notes: "Signed! Charity site with donations + volunteer sign-up. Kickoff next week.",
    next_follow_up_at: null, last_contacted_at: rel(-4, 10), created_at: rel(-21), updated_at: rel(-4),
  },
  {
    id: "lead-7", company: "Apex Plumbing & Heating", website: "https://apexplumbingheating.co.uk",
    contact_name: "Steve Doyle", email: "steve@apexplumbing.co.uk", phone: "+44 7700 900777",
    status: "new", source: "cold_outreach", priority: "medium", est_value: 1600,
    assigned_to: "crm-staff", created_by: "crm-staff",
    notes: "Found via Google — outdated site, no mobile version. Good fit for the trades template.",
    next_follow_up_at: rel(1, 13), last_contacted_at: null, created_at: rel(-2), updated_at: rel(-2),
  },
  {
    id: "lead-8", company: "Studio Lume Photography", website: "https://studiolume.co.uk",
    contact_name: "Nadia Khan", email: "nadia@studiolume.co.uk", phone: "+44 7700 900888",
    status: "qualified", source: "inbound", priority: "medium", est_value: 2200,
    assigned_to: "crm-owner-2", created_by: "crm-owner-2",
    notes: "Portfolio site for a photographer. Wants something editorial, lots of motion.",
    next_follow_up_at: rel(4, 10), last_contacted_at: rel(-2, 14), created_at: rel(-7), updated_at: rel(-2),
  },
  {
    id: "lead-9", company: "Greenfield Allotments Society", website: "https://greenfieldallotments.org.uk",
    contact_name: "Brian Webb", email: "brian@greenfieldallotments.org.uk", phone: "+44 7700 900999",
    status: "lost", source: "social", priority: "low", est_value: 1200,
    assigned_to: "crm-staff", created_by: "crm-staff",
    notes: "Went with a cheaper Wix freelancer. Keep warm for a rebuild next year.",
    next_follow_up_at: null, last_contacted_at: rel(-15, 10), created_at: rel(-28), updated_at: rel(-14),
  },
  {
    id: "lead-10", company: "Titan Strength Gym", website: "https://titanstrengthgym.co.uk",
    contact_name: "Ricky Adler", email: "ricky@titanstrength.co.uk", phone: "+44 7700 901010",
    status: "contacted", source: "event", priority: "high", est_value: 3000,
    assigned_to: "crm-staff", created_by: "crm-owner-1",
    notes: "Met at the local biz expo. Two locations, wants class timetables + PT bookings.",
    next_follow_up_at: rel(0, 16), last_contacted_at: rel(-1, 10), created_at: rel(-4), updated_at: rel(-1),
  },
  {
    id: "lead-11", company: "Maple & Co Accountants", website: "https://mapleaccountants.co.uk",
    contact_name: "Helen Forsythe", email: "helen@mapleaccountants.co.uk", phone: "+44 7700 901111",
    status: "proposal", source: "referral", priority: "high", est_value: 5200,
    assigned_to: "crm-owner-1", created_by: "crm-owner-1",
    notes: "Proposal for a credibility-first site + client portal landing page. Strong intent.",
    next_follow_up_at: rel(2, 15), last_contacted_at: rel(-2, 12), created_at: rel(-10), updated_at: rel(-2),
  },
  {
    id: "lead-12", company: "Riverside Dental Practice", website: "https://riversidedental.co.uk",
    contact_name: "Dr. Omar Yusuf", email: "omar@riversidedental.co.uk", phone: "+44 7700 901212",
    status: "new", source: "cold_outreach", priority: "medium", est_value: 2800,
    assigned_to: "crm-owner-2", created_by: "crm-owner-2",
    notes: "Private practice, current site is slow. Wants online booking + before/after gallery.",
    next_follow_up_at: rel(-2, 10), last_contacted_at: null, created_at: rel(-3), updated_at: rel(-3),
  },
];

const MOCK_ACTIVITIES: LeadActivity[] = [
  // lead-1 Northside Boxing
  { id: "act-1", lead_id: "lead-1", user_id: "crm-staff", type: "email", direction: "outbound", outcome: "replied", notes: "Sent intro + link to the Chuks Fitness case study. He replied asking for a call.", occurred_at: rel(-9, 10), follow_up_at: null, created_at: rel(-9, 10) },
  { id: "act-2", lead_id: "lead-1", user_id: "crm-staff", type: "call", direction: "outbound", outcome: "connected", notes: "10-min call. Wants memberships sold online + class booking. Budget ~£2.5k. Sending a quick scope.", occurred_at: rel(-2, 11), follow_up_at: rel(0, 14), created_at: rel(-2, 11) },
  // lead-2 Bright Beginnings
  { id: "act-3", lead_id: "lead-2", user_id: "crm-owner-1", type: "email", direction: "inbound", outcome: "replied", notes: "Inbound enquiry from the contact form. Replied within the hour with a few questions.", occurred_at: rel(-6, 9), follow_up_at: null, created_at: rel(-6, 9) },
  { id: "act-4", lead_id: "lead-2", user_id: "crm-owner-1", type: "call", direction: "outbound", outcome: "interested", notes: "Discovery call — needs gallery, waitlist form, Ofsted page. Qualified. Sending pricing.", occurred_at: rel(-1, 16), follow_up_at: rel(2, 10), created_at: rel(-1, 16) },
  // lead-3 Vale Driving
  { id: "act-5", lead_id: "lead-3", user_id: "crm-owner-2", type: "note", direction: "outbound", outcome: null, notes: "Referred by Tom at Clearway. Hasn't been contacted yet — Jamie to reach out.", occurred_at: rel(-1, 12), follow_up_at: rel(1, 9), created_at: rel(-1, 12) },
  // lead-4 Harmony Wellness
  { id: "act-6", lead_id: "lead-4", user_id: "crm-owner-2", type: "linkedin", direction: "outbound", outcome: "connected", notes: "Connected on LinkedIn after she liked our clinic post.", occurred_at: rel(-12, 13), follow_up_at: null, created_at: rel(-12, 13) },
  { id: "act-7", lead_id: "lead-4", user_id: "crm-owner-2", type: "meeting", direction: "outbound", outcome: "meeting_booked", notes: "Zoom walkthrough of the wellness template. Loved the booking flow.", occurred_at: rel(-6, 15), follow_up_at: null, created_at: rel(-6, 15) },
  { id: "act-8", lead_id: "lead-4", user_id: "crm-owner-2", type: "email", direction: "outbound", outcome: "no_response", notes: "Proposal sent (£4.5k, 6 pages + booking). Awaiting decision.", occurred_at: rel(-3, 15), follow_up_at: rel(-1, 11), created_at: rel(-3, 15) },
  // lead-5 Daily Grind
  { id: "act-9", lead_id: "lead-5", user_id: "crm-staff", type: "email", direction: "outbound", outcome: "replied", notes: "Cold email with a Loom of their current site's issues. Replied — interested but tight budget.", occurred_at: rel(-5, 9), follow_up_at: null, created_at: rel(-5, 9) },
  { id: "act-10", lead_id: "lead-5", user_id: "crm-staff", type: "call", direction: "outbound", outcome: "connected", notes: "Pitched the lite one-pager package. She'll check with her business partner.", occurred_at: rel(-2, 9), follow_up_at: rel(3, 11), created_at: rel(-2, 9) },
  // lead-6 Lighthouse (won)
  { id: "act-11", lead_id: "lead-6", user_id: "crm-owner-1", type: "meeting", direction: "outbound", outcome: "meeting_booked", notes: "Trustees meeting — walked through donations + volunteer flows.", occurred_at: rel(-14, 11), follow_up_at: null, created_at: rel(-14, 11) },
  { id: "act-12", lead_id: "lead-6", user_id: "crm-owner-1", type: "email", direction: "outbound", outcome: "interested", notes: "Sent proposal, £3.8k. They confirmed budget approved by the board.", occurred_at: rel(-7, 10), follow_up_at: null, created_at: rel(-7, 10) },
  { id: "act-13", lead_id: "lead-6", user_id: "crm-owner-1", type: "call", direction: "inbound", outcome: "connected", notes: "They called to say YES. Deposit invoice sent, kickoff booked.", occurred_at: rel(-4, 10), follow_up_at: null, created_at: rel(-4, 10) },
  // lead-7 Apex Plumbing
  { id: "act-14", lead_id: "lead-7", user_id: "crm-staff", type: "note", direction: "outbound", outcome: null, notes: "Found via Google. Site is non-responsive, no quote form. Strong fit — drafting cold email.", occurred_at: rel(-2, 9), follow_up_at: rel(1, 13), created_at: rel(-2, 9) },
  // lead-8 Studio Lume
  { id: "act-15", lead_id: "lead-8", user_id: "crm-owner-2", type: "email", direction: "inbound", outcome: "replied", notes: "Inbound — wants an editorial portfolio. Shared examples.", occurred_at: rel(-7, 14), follow_up_at: null, created_at: rel(-7, 14) },
  { id: "act-16", lead_id: "lead-8", user_id: "crm-owner-2", type: "call", direction: "outbound", outcome: "interested", notes: "Scoped a motion-heavy portfolio. Qualified. Following up with a mood-board.", occurred_at: rel(-2, 14), follow_up_at: rel(4, 10), created_at: rel(-2, 14) },
  // lead-9 Greenfield (lost)
  { id: "act-17", lead_id: "lead-9", user_id: "crm-staff", type: "email", direction: "outbound", outcome: "replied", notes: "Reached out via their Facebook page. Interested initially.", occurred_at: rel(-26, 10), follow_up_at: null, created_at: rel(-26, 10) },
  { id: "act-18", lead_id: "lead-9", user_id: "crm-staff", type: "call", direction: "outbound", outcome: "not_interested", notes: "Went with a cheaper Wix freelancer. Marked lost — keep warm for a rebuild.", occurred_at: rel(-15, 10), follow_up_at: null, created_at: rel(-15, 10) },
  // lead-10 Titan Strength
  { id: "act-19", lead_id: "lead-10", user_id: "crm-owner-1", type: "meeting", direction: "inbound", outcome: "connected", notes: "Met at the biz expo. Took his card, big energy. Handed to Jamie to run.", occurred_at: rel(-4, 12), follow_up_at: null, created_at: rel(-4, 12) },
  { id: "act-20", lead_id: "lead-10", user_id: "crm-staff", type: "call", direction: "outbound", outcome: "connected", notes: "Two locations, wants class timetables + PT booking. High intent. Sending options.", occurred_at: rel(-1, 10), follow_up_at: rel(0, 16), created_at: rel(-1, 10) },
  // lead-11 Maple & Co
  { id: "act-21", lead_id: "lead-11", user_id: "crm-owner-1", type: "call", direction: "outbound", outcome: "connected", notes: "Referral from Bright Beginnings. Wants a credibility-first site.", occurred_at: rel(-10, 12), follow_up_at: null, created_at: rel(-10, 12) },
  { id: "act-22", lead_id: "lead-11", user_id: "crm-owner-1", type: "email", direction: "outbound", outcome: "no_response", notes: "Proposal £5.2k sent (site + client portal landing). Strong intent, chasing sign-off.", occurred_at: rel(-2, 12), follow_up_at: rel(2, 15), created_at: rel(-2, 12) },
  // lead-12 Riverside Dental
  { id: "act-23", lead_id: "lead-12", user_id: "crm-owner-2", type: "note", direction: "outbound", outcome: null, notes: "Current site scores 31 on PageSpeed. Strong angle for the cold email. Drafting now.", occurred_at: rel(-3, 10), follow_up_at: rel(-2, 10), created_at: rel(-3, 10) },
];

// ---------------------------------------------------------------------------
// small helpers
// ---------------------------------------------------------------------------
async function db() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}

/** Build a quick id → member lookup. */
export function memberMap(team: CrmMember[]): Map<string, CrmMember> {
  return new Map(team.map((m) => [m.id, m]));
}

// ===========================================================================
// Queries
// ===========================================================================

/** The CRM team (2 owners + staff). */
export async function getCrmTeam(): Promise<CrmMember[]> {
  if (IS_MOCK) return MOCK_TEAM;
  const supabase = await db();
  const { data } = await supabase
    .from("profiles")
    .select("id, name, email, crm_role")
    .not("crm_role", "is", null)
    .order("crm_role");
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    name: (r.name as string) ?? (r.email as string),
    email: r.email as string,
    crm_role: r.crm_role as CrmMember["crm_role"],
  }));
}

export interface LeadFilters {
  status?: LeadStatus | "all" | "open";
  assignedTo?: string | "all";
  priority?: LeadPriority | "all";
  q?: string;
}

/** All leads, newest activity first, with optional filters. */
export async function getLeads(filters: LeadFilters = {}): Promise<Lead[]> {
  let rows: Lead[];
  if (IS_MOCK) {
    rows = [...MOCK_LEADS];
  } else {
    const supabase = await db();
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("updated_at", { ascending: false });
    rows = (data ?? []) as Lead[];
  }

  const { status, assignedTo, priority, q } = filters;
  if (status && status !== "all") {
    if (status === "open") rows = rows.filter((l) => l.status !== "won" && l.status !== "lost");
    else rows = rows.filter((l) => l.status === status);
  }
  if (assignedTo && assignedTo !== "all") {
    rows = rows.filter((l) => l.assigned_to === assignedTo);
  }
  if (priority && priority !== "all") {
    rows = rows.filter((l) => l.priority === priority);
  }
  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    rows = rows.filter((l) =>
      [l.company, l.contact_name, l.email, l.website, l.phone, l.notes]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(needle)),
    );
  }

  // sort: most recently updated first (mock already, prod via query)
  return rows.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
}

export async function getLeadById(id: string): Promise<Lead | null> {
  if (IS_MOCK) return MOCK_LEADS.find((l) => l.id === id) ?? null;
  const supabase = await db();
  const { data } = await supabase.from("leads").select("*").eq("id", id).single();
  return (data as Lead) ?? null;
}

/** Outreach log for one lead, newest first. */
export async function getActivitiesForLead(leadId: string): Promise<LeadActivity[]> {
  if (IS_MOCK) {
    return MOCK_ACTIVITIES.filter((a) => a.lead_id === leadId).sort((a, b) =>
      a.occurred_at < b.occurred_at ? 1 : -1,
    );
  }
  const supabase = await db();
  const { data } = await supabase
    .from("lead_activities")
    .select("*")
    .eq("lead_id", leadId)
    .order("occurred_at", { ascending: false });
  return (data ?? []) as LeadActivity[];
}

/** The whole team's most recent outreach (activity feed). */
export async function getRecentActivities(limit = 12): Promise<LeadActivity[]> {
  if (IS_MOCK) {
    return [...MOCK_ACTIVITIES]
      .sort((a, b) => (a.occurred_at < b.occurred_at ? 1 : -1))
      .slice(0, limit);
  }
  const supabase = await db();
  const { data } = await supabase
    .from("lead_activities")
    .select("*")
    .order("occurred_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as LeadActivity[];
}

/** Open leads that have a follow-up scheduled, soonest first. */
export async function getFollowUps(): Promise<Lead[]> {
  const leads = await getLeads({ status: "open" });
  return leads
    .filter((l) => l.next_follow_up_at)
    .sort((a, b) => (a.next_follow_up_at! < b.next_follow_up_at! ? -1 : 1));
}

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------
export interface CrmStats {
  total: number;
  open: number;
  byStatus: Record<LeadStatus, number>;
  openValue: number;
  wonValue: number;
  wonCount: number;
  followUpsDue: number; // overdue or due today
  followUpsUpcoming: number;
  newThisWeek: number;
}

export async function getCrmStats(): Promise<CrmStats> {
  const leads = await getLeads();
  const byStatus: Record<LeadStatus, number> = {
    new: 0, contacted: 0, qualified: 0, proposal: 0, won: 0, lost: 0,
  };
  let openValue = 0;
  let wonValue = 0;
  let wonCount = 0;
  let followUpsDue = 0;
  let followUpsUpcoming = 0;
  let newThisWeek = 0;

  const now = new Date();
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);

  for (const l of leads) {
    byStatus[l.status] += 1;
    const open = l.status !== "won" && l.status !== "lost";
    if (open) openValue += Number(l.est_value) || 0;
    if (l.status === "won") {
      wonValue += Number(l.est_value) || 0;
      wonCount += 1;
    }
    if (open && l.next_follow_up_at) {
      const due = new Date(l.next_follow_up_at);
      if (due <= endOfToday) followUpsDue += 1;
      else followUpsUpcoming += 1;
    }
    if (new Date(l.created_at) >= weekAgo) newThisWeek += 1;
  }

  const open = leads.filter((l) => l.status !== "won" && l.status !== "lost").length;
  return {
    total: leads.length, open, byStatus, openValue, wonValue, wonCount,
    followUpsDue, followUpsUpcoming, newThisWeek,
  };
}

export interface OutreachStat {
  member: CrmMember;
  calls: number;
  emails: number;
  meetings: number;
  other: number;
  total: number;
  contactTouches: number; // excludes notes
  positive: number; // positive outcomes
  followUpsOpen: number;
}

/** Per-member outreach totals (analytics leaderboard). */
export async function getOutreachStats(): Promise<OutreachStat[]> {
  const [team, activities, leads] = await Promise.all([
    getCrmTeam(),
    IS_MOCK ? Promise.resolve(MOCK_ACTIVITIES) : getAllActivities(),
    getLeads({ status: "open" }),
  ]);

  const byMember = new Map<string, OutreachStat>();
  for (const m of team) {
    byMember.set(m.id, {
      member: m, calls: 0, emails: 0, meetings: 0, other: 0,
      total: 0, contactTouches: 0, positive: 0, followUpsOpen: 0,
    });
  }

  for (const a of activities) {
    if (!a.user_id) continue;
    const s = byMember.get(a.user_id);
    if (!s) continue;
    s.total += 1;
    if (a.type === "call") s.calls += 1;
    else if (a.type === "email") s.emails += 1;
    else if (a.type === "meeting") s.meetings += 1;
    else s.other += 1;
    if (ACTIVITY_TYPE_META[a.type]?.contact) s.contactTouches += 1;
    if (a.outcome && POSITIVE_OUTCOMES.includes(a.outcome)) s.positive += 1;
  }

  for (const l of leads) {
    if (l.assigned_to && l.next_follow_up_at) {
      const s = byMember.get(l.assigned_to);
      if (s) s.followUpsOpen += 1;
    }
  }

  return [...byMember.values()].sort((a, b) => b.total - a.total);
}

async function getAllActivities(): Promise<LeadActivity[]> {
  const supabase = await db();
  const { data } = await supabase
    .from("lead_activities")
    .select("*")
    .order("occurred_at", { ascending: false });
  return (data ?? []) as LeadActivity[];
}

// ---------------------------------------------------------------------------
// Website analytics (owners only). Live traffic needs an analytics provider
// (Vercel Web Analytics / Plausible); until that's wired this returns a
// representative sample so the panel is fully designed and ready.
// ---------------------------------------------------------------------------
export interface WebsiteAnalytics {
  live: boolean;
  rangeDays: number;
  visitors: number;
  uniqueVisitors: number;
  pageviews: number;
  clicks: number; // total tracked CTA / link clicks
  avgSessionSeconds: number;
  bounceRate: number; // 0..1
  enquiries: number;
  /** % change vs the previous period (e.g. 12.4 = +12.4%). */
  deltas: {
    visitors: number;
    uniqueVisitors: number;
    pageviews: number;
    clicks: number;
    enquiries: number;
    bounceRate: number;
  };
  series: { date: string; visitors: number; pageviews: number }[];
  /** Search Console–style keyword performance. */
  keywords: { query: string; clicks: number; impressions: number; ctr: number; position: number }[];
  topPages: { path: string; views: number; avgSeconds: number }[];
  /** Tracked button / link clicks. */
  ctas: { label: string; clicks: number }[];
  sources: { label: string; visitors: number }[];
  devices: { label: string; share: number }[]; // share 0..1
  countries: { label: string; visitors: number }[];
  referrers: { label: string; visitors: number }[];
}

export async function getWebsiteAnalytics(): Promise<WebsiteAnalytics> {
  // Deterministic 14-day series (sample until GA4 / Search Console is wired).
  const base = [220, 248, 191, 305, 277, 412, 388, 354, 401, 333, 366, 298, 277, 245];
  const series = base.map((v, i) => ({
    date: rel(-(base.length - 1 - i), 0).slice(0, 10),
    visitors: v,
    pageviews: Math.round(v * 2.6),
  }));
  const visitors = series.reduce((s, d) => s + d.visitors, 0);
  const pageviews = series.reduce((s, d) => s + d.pageviews, 0);
  const ctas = [
    { label: "Enrol now", clicks: 312 },
    { label: "View our work", clicks: 274 },
    { label: "Enquire", clicks: 168 },
    { label: "Book a call", clicks: 121 },
    { label: "WhatsApp us", clicks: 64 },
  ];
  const clicks = ctas.reduce((s, c) => s + c.clicks, 0);
  return {
    live: false,
    rangeDays: 14,
    visitors,
    uniqueVisitors: Math.round(visitors * 0.78),
    pageviews,
    clicks,
    avgSessionSeconds: 92,
    bounceRate: 0.41,
    enquiries: 23,
    deltas: {
      visitors: 12.4,
      uniqueVisitors: 9.8,
      pageviews: 8.1,
      clicks: 21.0,
      enquiries: 15.0,
      bounceRate: -2.3,
    },
    series,
    keywords: [
      { query: "ai website bootcamp", clicks: 142, impressions: 3120, ctr: 0.046, position: 3.2 },
      { query: "learn to build websites with ai", clicks: 98, impressions: 2740, ctr: 0.036, position: 5.1 },
      { query: "bridgeway ai bootcamp", clicks: 87, impressions: 540, ctr: 0.161, position: 1.2 },
      { query: "web design course london", clicks: 64, impressions: 4310, ctr: 0.015, position: 8.7 },
      { query: "build a website with ai", clicks: 59, impressions: 5120, ctr: 0.012, position: 11.3 },
      { query: "no code web design course", clicks: 43, impressions: 1980, ctr: 0.022, position: 6.4 },
      { query: "ai web development training", clicks: 38, impressions: 1620, ctr: 0.023, position: 7.0 },
      { query: "freelance web designer course", clicks: 29, impressions: 2210, ctr: 0.013, position: 12.1 },
    ],
    topPages: [
      { path: "/", views: Math.round(pageviews * 0.34), avgSeconds: 74 },
      { path: "/work", views: Math.round(pageviews * 0.22), avgSeconds: 118 },
      { path: "/pricing", views: Math.round(pageviews * 0.16), avgSeconds: 96 },
      { path: "/contact", views: Math.round(pageviews * 0.11), avgSeconds: 64 },
      { path: "/success-stories", views: Math.round(pageviews * 0.09), avgSeconds: 88 },
      { path: "/faq", views: Math.round(pageviews * 0.08), avgSeconds: 52 },
    ],
    ctas,
    sources: [
      { label: "Organic search", visitors: Math.round(visitors * 0.38) },
      { label: "Direct", visitors: Math.round(visitors * 0.27) },
      { label: "Social", visitors: Math.round(visitors * 0.21) },
      { label: "Referral", visitors: Math.round(visitors * 0.14) },
    ],
    devices: [
      { label: "Mobile", share: 0.62 },
      { label: "Desktop", share: 0.33 },
      { label: "Tablet", share: 0.05 },
    ],
    countries: [
      { label: "🇬🇧 United Kingdom", visitors: Math.round(visitors * 0.71) },
      { label: "🇳🇬 Nigeria", visitors: Math.round(visitors * 0.09) },
      { label: "🇺🇸 United States", visitors: Math.round(visitors * 0.06) },
      { label: "🇮🇪 Ireland", visitors: Math.round(visitors * 0.04) },
      { label: "🇨🇦 Canada", visitors: Math.round(visitors * 0.03) },
    ],
    referrers: [
      { label: "instagram.com", visitors: Math.round(visitors * 0.11) },
      { label: "google.com", visitors: Math.round(visitors * 0.08) },
      { label: "linkedin.com", visitors: Math.round(visitors * 0.05) },
      { label: "youtube.com", visitors: Math.round(visitors * 0.03) },
      { label: "tiktok.com", visitors: Math.round(visitors * 0.02) },
    ],
  };
}

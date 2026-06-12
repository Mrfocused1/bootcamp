import type {
  Profile,
  Cohort,
  Day,
  Lesson,
  Progress,
  LiveSession,
  Announcement,
  StudentSummary,
  AiMessage,
  SessionRecording,
  PlayableRecording,
} from "@/lib/types";
import {
  IS_MOCK,
  getMockCohort,
  getMockProfile,
  MOCK_DAYS,
  MOCK_LESSONS,
  MOCK_PROGRESS,
  getMockUpcomingSessions,
  getMockSessionRecordings,
  getMockAnnouncement,
  getMockStudents,
  getMockAiMessages,
  getMockDayFunnel,
  SAMPLE_VIDEO_URL,
  type DayFunnelEntry,
} from "@/lib/mock";

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
export async function getCurrentProfile(): Promise<Profile> {
  if (IS_MOCK) return getMockProfile();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { data } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .eq("id", user.id)
    .single();
  return data as Profile;
}

// ---------------------------------------------------------------------------
// Cohort
// ---------------------------------------------------------------------------
export async function getCohort(): Promise<Cohort> {
  if (IS_MOCK) return getMockCohort();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("cohorts")
    .select("id, name, start_date")
    .order("start_date", { ascending: false })
    .limit(1)
    .single();
  return data as Cohort;
}

// ---------------------------------------------------------------------------
// Days
// ---------------------------------------------------------------------------
export async function getDays(): Promise<Day[]> {
  if (IS_MOCK) return MOCK_DAYS;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("days")
    .select("id, day_index, title, description")
    .order("day_index");
  return (data ?? []) as Day[];
}

// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------
export async function getLessons(): Promise<Lesson[]> {
  if (IS_MOCK) return MOCK_LESSONS;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("lessons")
    .select(
      "id, day_id, day_index, title, video_provider, video_id, duration_seconds, resources, topics, chapters, order"
    )
    .order("order");
  return ((data ?? []) as (Omit<Lesson, "chapters"> & { chapters?: Lesson["chapters"] })[]).map(
    (row) => ({ ...row, chapters: row.chapters ?? [] })
  ) as Lesson[];
}

// ---------------------------------------------------------------------------
// Progress map  (lesson_id → Progress)
// ---------------------------------------------------------------------------
export async function getProgressMap(): Promise<Record<string, Progress>> {
  if (IS_MOCK) return MOCK_PROGRESS;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return {};
  const { data } = await supabase
    .from("progress")
    .select("lesson_id, last_position_seconds, watched_percent, completed")
    .eq("user_id", user.id);
  const map: Record<string, Progress> = {};
  for (const row of data ?? []) {
    map[(row as Progress).lesson_id] = row as Progress;
  }
  return map;
}

// ---------------------------------------------------------------------------
// Single lesson by day index
// ---------------------------------------------------------------------------
export async function getLessonByDayIndex(
  i: number
): Promise<{ day: Day; lesson: Lesson } | null> {
  if (IS_MOCK) {
    const day = MOCK_DAYS.find((d) => d.day_index === i) ?? null;
    const lesson = MOCK_LESSONS.find((l) => l.day_index === i) ?? null;
    if (!day || !lesson) return null;
    return { day, lesson };
  }
  const [days, lessons] = await Promise.all([getDays(), getLessons()]);
  const day = days.find((d) => d.day_index === i) ?? null;
  const lesson = lessons.find((l) => l.day_index === i) ?? null;
  if (!day || !lesson) return null;
  return { day, lesson };
}

// ---------------------------------------------------------------------------
// Upcoming live sessions
// ---------------------------------------------------------------------------
export async function getUpcomingSessions(): Promise<LiveSession[]> {
  if (IS_MOCK) return getMockUpcomingSessions();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("live_sessions")
    .select("id, day_index, scheduled_at, zoom_url")
    .gte("scheduled_at", now)
    .order("scheduled_at")
    .limit(3);
  return (data ?? []) as LiveSession[];
}

// ---------------------------------------------------------------------------
// Session recordings
// ---------------------------------------------------------------------------

/** Recordings the current (enrolled) student can watch for a given day, each
 *  with a ready-to-play URL (signed in prod, a sample clip in mock). */
export async function getRecordingsForDay(dayIndex: number): Promise<PlayableRecording[]> {
  if (IS_MOCK) {
    return getMockSessionRecordings()
      .filter((r) => r.day_index === dayIndex)
      .map((r) => ({
        id: r.id,
        day_index: r.day_index,
        title: r.title,
        url: SAMPLE_VIDEO_URL,
        duration_seconds: r.duration_seconds,
        recorded_at: r.recorded_at,
      }));
  }
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  // RLS limits rows to the student's enrolled cohort (or all, for admins).
  const { data } = await supabase
    .from("session_recordings")
    .select("id, day_index, title, object_key, duration_seconds, recorded_at")
    .eq("day_index", dayIndex)
    .order("recorded_at", { ascending: false });
  const rows = (data ?? []) as SessionRecording[];
  const { presignPlayback } = await import("@/lib/r2");
  return Promise.all(
    rows.map(async (r) => ({
      id: r.id,
      day_index: r.day_index,
      title: r.title,
      url: await presignPlayback(r.object_key),
      duration_seconds: r.duration_seconds,
      recorded_at: r.recorded_at,
    })),
  );
}

/** All recordings (admin view). */
export async function getAllRecordings(): Promise<SessionRecording[]> {
  if (IS_MOCK) return getMockSessionRecordings();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("session_recordings")
    .select("id, cohort_id, day_index, title, object_key, duration_seconds, recorded_at")
    .order("recorded_at", { ascending: false });
  return (data ?? []) as SessionRecording[];
}

/** All cohorts (admin view — for the recording upload form). */
export async function getAllCohorts(): Promise<Cohort[]> {
  if (IS_MOCK) return [getMockCohort()];
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("cohorts")
    .select("id, name, start_date")
    .order("start_date", { ascending: false });
  return (data ?? []) as Cohort[];
}

// ---------------------------------------------------------------------------
// Latest announcement
// ---------------------------------------------------------------------------
export async function getLatestAnnouncement(): Promise<Announcement | null> {
  if (IS_MOCK) return getMockAnnouncement();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  return (data as Announcement) ?? null;
}

// ---------------------------------------------------------------------------
// Admin: all students
// ---------------------------------------------------------------------------
export async function getStudents(): Promise<StudentSummary[]> {
  if (IS_MOCK) return getMockStudents();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("student_summaries")
    .select("profile, cohort, overall_percent");
  return (data ?? []).map((row: Record<string, unknown>) => ({
    profile: row.profile as Profile,
    cohort: row.cohort as Cohort,
    overallPercent: row.overall_percent as number,
  }));
}

// ---------------------------------------------------------------------------
// Analytics: per-day funnel (started vs completed)
// ---------------------------------------------------------------------------
export async function getDayFunnel(): Promise<DayFunnelEntry[]> {
  if (IS_MOCK) return getMockDayFunnel();
  // Real-mode stub — query a view or aggregate from a progress table:
  // const { createClient } = await import("@/lib/supabase/server");
  // const supabase = await createClient();
  // const { data } = await supabase.from("day_funnel").select("day, started, completed");
  // return (data ?? []) as DayFunnelEntry[];
  return getMockDayFunnel();
}

export type { DayFunnelEntry };

// ---------------------------------------------------------------------------
// AI messages
// ---------------------------------------------------------------------------
export async function getAiMessages(): Promise<AiMessage[]> {
  if (IS_MOCK) return getMockAiMessages();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("ai_messages")
    .select("id, role, content, created_at, lesson_id")
    .eq("user_id", user.id)
    .order("created_at");
  return (data ?? []) as AiMessage[];
}

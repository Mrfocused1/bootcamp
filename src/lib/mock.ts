import type {
  Profile,
  Cohort,
  Day,
  Lesson,
  Progress,
  LiveSession,
  Announcement,
  AiMessage,
  StudentSummary,
  Chapter,
  SessionRecording,
} from "@/lib/types";

export const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Returns today's ISO date string (YYYY-MM-DD) without breaking test environments. */
function mockToday(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Returns a YYYY-MM-DD string offset by `days` from today. */
function offsetDate(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function getMockCohort(): Cohort {
  return {
    id: "cohort-1",
    name: "June 2026 Cohort",
    start_date: offsetDate(-3), // 3 days ago → Days 1–3 unlocked
  };
}

export const MOCK_DAYS: Day[] = [
  {
    id: "day-1",
    day_index: 1,
    title: "Build the look",
    description:
      "Learn to clone websites and generate AI images using the best tools on the market.",
  },
  {
    id: "day-2",
    day_index: 2,
    title: "Make it real",
    description:
      "Connect your project to a real database and version control with Supabase and GitHub.",
  },
  {
    id: "day-3",
    day_index: 3,
    title: "Get paid & connected",
    description:
      "Integrate Stripe payments, transactional email with Resend, and CRM basics.",
  },
  {
    id: "day-4",
    day_index: 4,
    title: "Launch it live",
    description:
      "Deploy to a real domain, debug production issues, and go live with confidence.",
  },
  {
    id: "day-5",
    day_index: 5,
    title: "Get found & grow",
    description:
      "Master SEO fundamentals, set up analytics, and join our live Q&A session.",
  },
];

export const SAMPLE_VIDEO_URL =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

const DAY1_CHAPTERS: Chapter[] = [
  { title: "Intro & setup", start_seconds: 0 },
  { title: "Cursor basics", start_seconds: 60 },
  { title: "Cloning a website", start_seconds: 180 },
  { title: "AI images with ChatGPT", start_seconds: 330 },
  { title: "Voice coding with Whisper", start_seconds: 480 },
];

export const MOCK_LESSONS: Lesson[] = [
  {
    id: "lesson-1",
    day_id: "day-1",
    day_index: 1,
    title: "Cursor, cloning & AI images",
    video_provider: "mp4",
    video_id: SAMPLE_VIDEO_URL,
    duration_seconds: 596,
    chapters: DAY1_CHAPTERS,
    resources: [
      { label: "Cursor IDE", url: "https://cursor.sh" },
      { label: "ChatGPT", url: "https://chat.openai.com" },
    ],
    topics: ["Cursor", "Cloning websites", "AI images (ChatGPT)", "Voice coding (Whisper)"],
    order: 1,
  },
  {
    id: "lesson-2",
    day_id: "day-2",
    day_index: 2,
    title: "Supabase & GitHub",
    video_provider: "mp4",
    video_id: SAMPLE_VIDEO_URL,
    duration_seconds: 596,
    chapters: [
      { title: "Intro to Supabase", start_seconds: 0 },
      { title: "Creating tables & RLS", start_seconds: 120 },
      { title: "GitHub & version control", start_seconds: 300 },
      { title: "Connecting to Next.js", start_seconds: 450 },
    ],
    resources: [
      { label: "Supabase docs", url: "https://supabase.com/docs" },
      { label: "GitHub", url: "https://github.com" },
    ],
    topics: ["Supabase", "GitHub"],
    order: 1,
  },
  {
    id: "lesson-3",
    day_id: "day-3",
    day_index: 3,
    title: "Stripe, Resend & CRMs",
    video_provider: "mp4",
    video_id: SAMPLE_VIDEO_URL,
    duration_seconds: 596,
    chapters: [
      { title: "Setting up Stripe", start_seconds: 0 },
      { title: "Checkout & webhooks", start_seconds: 150 },
      { title: "Transactional email with Resend", start_seconds: 350 },
      { title: "CRM basics", start_seconds: 500 },
    ],
    resources: [
      { label: "Stripe docs", url: "https://stripe.com/docs" },
      { label: "Resend", url: "https://resend.com" },
    ],
    topics: ["Stripe", "Resend", "CRMs"],
    order: 1,
  },
  {
    id: "lesson-4",
    day_id: "day-4",
    day_index: 4,
    title: "Hosting, domains & debugging",
    video_provider: "mp4",
    video_id: SAMPLE_VIDEO_URL,
    duration_seconds: 596,
    chapters: [
      { title: "Deploying to Vercel", start_seconds: 0 },
      { title: "Custom domains on Namecheap", start_seconds: 180 },
      { title: "Debugging production issues", start_seconds: 390 },
    ],
    resources: [
      { label: "Vercel", url: "https://vercel.com" },
      { label: "Namecheap", url: "https://namecheap.com" },
    ],
    topics: ["Hosting", "Domains", "Debugging"],
    order: 1,
  },
  {
    id: "lesson-5",
    day_id: "day-5",
    day_index: 5,
    title: "SEO, analytics & live Q&A",
    video_provider: "mp4",
    video_id: SAMPLE_VIDEO_URL,
    duration_seconds: 596,
    chapters: [
      { title: "SEO fundamentals", start_seconds: 0 },
      { title: "Setting up analytics", start_seconds: 200 },
      { title: "Live Q&A highlights", start_seconds: 430 },
    ],
    resources: [
      { label: "Google Search Console", url: "https://search.google.com/search-console" },
      { label: "Plausible Analytics", url: "https://plausible.io" },
    ],
    topics: ["SEO", "Analytics", "Live Q&A"],
    order: 1,
  },
];

export const MOCK_PROGRESS: Record<string, Progress> = {
  "lesson-1": {
    lesson_id: "lesson-1",
    last_position_seconds: 3600,
    watched_percent: 100,
    completed: true,
  },
  "lesson-2": {
    lesson_id: "lesson-2",
    last_position_seconds: 1620,
    watched_percent: 45,
    completed: false,
  },
};

export function getMockProfile(): Profile {
  if (process.env.NEXT_PUBLIC_MOCK_ADMIN === "1") {
    return {
      id: "admin-1",
      name: "Admin User",
      email: "admin@urbanai.co",
      role: "admin",
    };
  }
  return {
    id: "student-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "student",
  };
}

export function getMockUpcomingSessions(): LiveSession[] {
  return [
    {
      id: "session-1",
      day_index: 4,
      scheduled_at: offsetDate(1) + "T18:00:00Z",
      zoom_url: "https://zoom.us/j/123",
    },
    {
      id: "session-2",
      day_index: 5,
      scheduled_at: offsetDate(2) + "T18:00:00Z",
      zoom_url: "https://zoom.us/j/123",
    },
  ];
}

export function getMockSessionRecordings(): SessionRecording[] {
  // In mock mode the "object_key" is unused; queries return SAMPLE_VIDEO_URL.
  return [
    {
      id: "rec-1",
      cohort_id: "cohort-1",
      day_index: 1,
      title: "Day 1 — live session replay",
      object_key: "mock",
      duration_seconds: 3600,
      recorded_at: offsetDate(-3) + "T19:00:00Z",
    },
    {
      id: "rec-2",
      cohort_id: "cohort-1",
      day_index: 2,
      title: "Day 2 — live session replay",
      object_key: "mock",
      duration_seconds: 3600,
      recorded_at: offsetDate(-2) + "T19:00:00Z",
    },
  ];
}

export function getMockAnnouncement(): Announcement {
  return {
    id: "ann-1",
    title: "Welcome to Bridgeway AI Bootcamp!",
    body: "We're thrilled to have you in the June cohort. Day 1 is live — jump in and start building. See you at the live Q&A on Day 4!",
    created_at: offsetDate(-3) + "T09:00:00Z",
  };
}

export function getMockStudents(): StudentSummary[] {
  const cohort = getMockCohort();
  const names = [
    ["Jordan Lee", "jordan@example.com"],
    ["Sam Rivera", "sam@example.com"],
    ["Morgan Kim", "morgan@example.com"],
    ["Taylor Patel", "taylor@example.com"],
    ["Casey Okonkwo", "casey@example.com"],
    ["Riley Chen", "riley@example.com"],
  ];
  return names.map(([name, email], i) => ({
    profile: {
      id: `student-${i + 2}`,
      name,
      email,
      role: "student" as const,
    },
    cohort,
    overallPercent: Math.round(Math.random() * 100),
  }));
}

export function getMockAiMessages(): AiMessage[] {
  return [
    {
      id: "msg-1",
      role: "user",
      content: "How do I connect Supabase to my Next.js project?",
      created_at: offsetDate(-2) + "T10:00:00Z",
      lesson_id: "lesson-2",
    },
    {
      id: "msg-2",
      role: "assistant",
      content:
        "Great question! Start by installing @supabase/ssr and @supabase/supabase-js, then create a server client using `createServerClient` from @supabase/ssr with your project URL and anon key from the Supabase dashboard.",
      created_at: offsetDate(-2) + "T10:00:30Z",
      lesson_id: "lesson-2",
    },
    {
      id: "msg-3",
      role: "user",
      content: "What's the difference between the anon key and service role key?",
      created_at: offsetDate(-1) + "T14:00:00Z",
      lesson_id: null,
    },
    {
      id: "msg-4",
      role: "assistant",
      content:
        "The anon key is safe to expose in the browser — it respects your Row Level Security (RLS) policies. The service role key bypasses RLS entirely and should only ever be used server-side in a trusted environment.",
      created_at: offsetDate(-1) + "T14:00:45Z",
      lesson_id: null,
    },
  ];
}

export interface DayFunnelEntry {
  day: number;
  started: number;
  completed: number;
}

/** Realistic drop-off data across the 5-day cohort. */
export function getMockDayFunnel(): DayFunnelEntry[] {
  return [
    { day: 1, started: 20, completed: 18 },
    { day: 2, started: 20, completed: 14 },
    { day: 3, started: 18, completed: 9 },
    { day: 4, started: 15, completed: 6 },
    { day: 5, started: 12, completed: 4 },
  ];
}

export { mockToday };

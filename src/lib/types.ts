export type Role = "student" | "admin";

export interface Chapter {
  title: string;
  start_seconds: number;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: Role;
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

export interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  lesson_id: string | null;
}

export interface StudentSummary {
  profile: Profile;
  cohort: Cohort;
  overallPercent: number;
}

import type { Metadata } from "next";
import { CrossingMarqueeHero } from "@/components/marketing/CrossingMarqueeHero";

export const metadata: Metadata = {
  title: "Success Stories — Bridgeway AI Bootcamp",
  description:
    "Real people, real websites. Success stories from Bridgeway students, founders and teams are coming soon.",
};

// NOTE(owner): the stories grid + final CTA are hidden until real success
// stories are ready — see git history for the previous STORIES data and
// layout (StoriesGrid + FinalCta) to restore them.
export default function SuccessStoriesPage() {
  return <CrossingMarqueeHero />;
}

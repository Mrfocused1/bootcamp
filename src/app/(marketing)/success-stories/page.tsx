import type { Metadata } from "next";
import { CrossingMarqueeHero } from "@/components/marketing/CrossingMarqueeHero";
import { StoriesGrid } from "@/components/marketing/StoriesGrid";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "Success Stories — Bridgeway AI Bootcamp",
  description:
    "Real people, real websites. See the apps, stores and booking sites Bridgeway students, founders and teams have built and launched with AI.",
};

const STORIES = [
  { name: "Maya R.", category: "Apps", title: "ai meal-planning app", result: "Launched in 7 days, now 300+ users", video: "/marketing/story-clip-1.mp4" },
  { name: "Daniel K.", category: "Stores", title: "coffee subscription store", result: "First paying customer in week one" },
  { name: "Priya S.", category: "Apps", title: "online tutoring platform", result: "Replaced a £6k agency quote" },
  { name: "Leah M.", category: "Stores", title: "handmade jewellery shop", result: "£2k in sales the first month" },
  { name: "Marcus O.", category: "Booking", title: "barber booking site", result: "Fully booked weekends now" },
  { name: "Tom B.", category: "Sites", title: "author portfolio", result: "Landed a publishing deal" },
  { name: "Aisha N.", category: "Apps", title: "fitness coaching site", result: "40 paying members in month one" },
  { name: "Sam W.", category: "SaaS", title: "saas dashboard", result: "From idea to MVP in a weekend" },
];

export default function SuccessStoriesPage() {
  return (
    <>
      <CrossingMarqueeHero />

      {/* Stories grid — scattered tilt + scroll-parallax budge */}
      <section className="bg-ua-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <StoriesGrid stories={STORIES} />
        </div>
      </section>

      <FinalCta />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { StoriesGrid, type Story } from "@/components/marketing/StoriesGrid";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "Our Work — Bridgeway AI Bootcamp",
  description:
    "Websites we've designed, built and shipped with AI — stores, booking sites, portfolios and apps, built with the exact workflow we teach in the bootcamp.",
};

// TODO(owner): replace the placeholder projects below with real client work —
// image (4:3 or 3:4), live URL, and a one-line result each.
const PROJECTS: Story[] = [
  {
    name: "More Fire Sauce",
    category: "Brand & store",
    title: "hot sauce brand site",
    result: "Brand, storefront and checkout — shipped in days",
    image: "/marketing/work-1.jpg",
  },
  {
    name: "Flair Studio",
    category: "Booking",
    title: "salon booking site",
    result: "Online bookings replacing DM back-and-forth",
    image: "/marketing/people-3.jpg",
  },
  {
    name: "Placeholder",
    category: "Stores",
    title: "coffee subscription store",
    result: "Subscriptions with Stripe billing",
  },
  {
    name: "Placeholder",
    category: "Sites",
    title: "author portfolio",
    result: "A home for the books and the press",
  },
  {
    name: "Placeholder",
    category: "SaaS",
    title: "saas dashboard",
    result: "From idea to working MVP",
  },
  {
    name: "Placeholder",
    category: "Charity",
    title: "community charity site",
    result: "Donations and volunteer sign-ups in-house",
  },
];

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="portfolio"
        title="our work"
        intro="Real websites we've designed, built and shipped with AI — the same workflow we teach in the bootcamp."
        sticker="shooting-star"
      />

      {/* Project grid — scattered tilt + scroll-parallax budge (GSAP) */}
      <section className="bg-ua-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <StoriesGrid stories={PROJECTS} />
        </div>
      </section>

      <FinalCta />
    </>
  );
}

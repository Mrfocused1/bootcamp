import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { WorkCategories } from "@/components/marketing/WorkCategories";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "Our Work — Bridgeway AI Bootcamp",
  description:
    "Websites we've designed, built and shipped with AI — charities (Youth n Rise, Commonwell, Stepping Stones, Springboard), with creatives and sports coming soon. The same workflow we teach in the bootcamp.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="portfolio"
        title="our work"
        intro="Real websites we've designed, built and shipped with AI — the same workflow we teach in the bootcamp."
        sticker="shooting-star"
      />

      <WorkCategories />

      <FinalCta />
    </>
  );
}

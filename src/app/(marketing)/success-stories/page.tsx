import type { Metadata } from "next";
import Link from "next/link";
import { CrossingMarqueeHero } from "@/components/marketing/CrossingMarqueeHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "Success Stories — Bridgeway AI Bootcamp",
  description:
    "Real people, real websites. See the apps, stores and booking sites Bridgeway students, founders and teams have built and launched with AI.",
};

const STORIES = [
  { name: "Maya R.", category: "Apps", title: "ai meal-planning app", result: "Launched in 7 days, now 300+ users" },
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

      {/* Stories grid */}
      <section className="bg-ua-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {STORIES.map((story, i) => {
              const img = `/marketing/placeholders/p${(i % 8) + 1}.png`;
              return (
                <Reveal key={story.title}>
                  <div className="relative h-full overflow-hidden rounded-3xl border-2 border-ua-ink bg-white shadow-[6px_6px_0_var(--ua-ink)]">
                    {i === 0 && (
                      <Sticker
                        name="hundred"
                        size={76}
                        rotate={10}
                        className="absolute -right-3 -top-6 z-10"
                      />
                    )}
                    {i === 4 && (
                      <Sticker
                        name="sparkles"
                        size={72}
                        rotate={-12}
                        className="absolute -left-4 -top-6 z-10"
                      />
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt=""
                      aria-hidden="true"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="p-6">
                      <span className="inline-block rounded-full bg-ua-sky px-3 py-1 text-xs font-bold text-ua-ink">
                        {story.category}
                      </span>
                      <p className="mt-4 text-sm text-ua-ink/60">{story.name}</p>
                      <h3
                        className="mt-1 text-2xl font-bold lowercase text-ua-ink"
                        style={{ fontFamily: "var(--font-epilogue)" }}
                      >
                        {story.title}
                      </h3>
                      <p className="mt-3 text-lg text-ua-ink/80">{story.result}</p>
                      <Link
                        href="#"
                        className="mt-5 inline-block font-bold text-ua-blue underline-offset-4 hover:underline"
                      >
                        View site →
                      </Link>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

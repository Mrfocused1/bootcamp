import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Sticker } from "@/components/marketing/Sticker";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "Syllabus — Bridgeway AI Bootcamp",
  description:
    "The full Bridgeway AI Bootcamp syllabus: twelve essential skills across five focused one-hour live sessions. From building the look to getting found on Google — every session recorded so you can rewatch any time.",
};

const DAYS = [
  {
    n: 1,
    color: "bg-ua-green",
    sticker: "cursor-star",
    title: "build the look",
    promise: "By the end of day 1 you'll have a great-looking site on screen.",
    topics: [
      "Set up & build in Cursor",
      "Clone any website from a link",
      "Recreate a design from a screenshot",
      "Generate images with AI",
      "Voice-control coding with Whisper",
    ],
  },
  {
    n: 2,
    color: "bg-ua-blue text-ua-bg",
    sticker: "lightning",
    title: "make it real",
    promise: "By the end of day 2 your site stores and remembers real data.",
    topics: [
      "Databases with Supabase",
      "User sign-up & login",
      "Connect your front-end",
      "Version control with GitHub",
    ],
  },
  {
    n: 3,
    color: "bg-ua-orange",
    sticker: "hundred",
    title: "get paid & connected",
    promise: "By the end of day 3 you can take money and talk to customers.",
    topics: [
      "Payments with Stripe",
      "Transactional emails with Resend",
      "Set up a CRM",
      "Capture & manage leads",
    ],
  },
  {
    n: 4,
    color: "bg-ua-pink",
    sticker: "earth",
    title: "launch it live",
    promise: "By the end of day 4 your site is live on the internet.",
    topics: [
      "Hosting your site",
      "Connect a custom domain",
      "Go live to the world",
      "Debug like a pro",
    ],
  },
  {
    n: 5,
    color: "bg-ua-sky",
    sticker: "megaphone",
    title: "get found & grow",
    promise: "By the end of day 5 people can find your site and you know what's next.",
    topics: [
      "SEO fundamentals",
      "Rank on Google",
      "Analytics & iteration",
      "Recap + live Q&A",
    ],
  },
];

export default function SyllabusPage() {
  return (
    <>
      <PageHero
        eyebrow="5 days · 1 hour a day · live on Zoom"
        title="the syllabus"
        intro="Twelve essential skills, spread across five focused one-hour live sessions. Every session is recorded, so you can rewatch any topic whenever you like."
        sticker="sparkles"
      />

      {/*
        Days — CSS sticky scroll-stack (same as the homepage curriculum deck):
        each card sticks just below the nav and the next one stacks on top as you
        scroll; uniform-height slots make them hold then exit together. Reduced
        motion falls back to a plain spaced vertical list.
      */}
      <section className="bg-ua-bg px-6 pb-24 pt-10 md:px-10">
        <div className="mx-auto flex max-w-4xl flex-col">
          {DAYS.map((day, i) => {
            const dark = day.color.includes("text-ua-bg");
            const bodyText = dark ? "text-ua-bg/90" : "text-ua-ink/80";
            const labelText = dark ? "text-ua-bg/70" : "text-ua-ink/60";
            const numText = dark ? "text-ua-bg/30" : "text-ua-ink/20";
            const borderText = dark ? "border-ua-bg/40" : "border-ua-ink/40";

            return (
              <div
                key={day.n}
                className="sticky flex h-[40rem] items-start justify-center motion-reduce:static motion-reduce:mb-10 motion-reduce:h-auto"
                style={{ top: `calc(6rem + ${i * 0.8}rem)`, zIndex: i + 1 }}
              >
                <div
                  className={`relative w-full rounded-3xl border-2 border-ua-ink ${day.color} px-6 pb-8 pt-10 shadow-[6px_6px_0_var(--ua-ink)] md:px-10`}
                >
                  <Sticker
                    name={day.sticker}
                    size={84}
                    rotate={8}
                    className="absolute -right-4 -top-8 z-10"
                  />

                  <div className="flex flex-col gap-5 md:flex-row md:gap-10">
                    {/* Left: big day number */}
                    <div className="flex-shrink-0">
                      <span
                        className={`block text-6xl font-black leading-none md:text-8xl ${numText}`}
                        style={{ fontFamily: "var(--font-epilogue)" }}
                      >
                        {day.n}
                      </span>
                    </div>

                    {/* Right: content */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-bold uppercase tracking-[0.2em] ${labelText}`}
                      >
                        Day {day.n} · 1 hour live
                      </p>
                      <h2
                        className="mt-2 text-3xl font-bold lowercase tracking-tight md:text-4xl"
                        style={{ fontFamily: "var(--font-epilogue)" }}
                      >
                        {day.title}
                      </h2>
                      <p className={`mt-3 text-lg ${bodyText}`}>{day.promise}</p>

                      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                        {day.topics.map((topic) => (
                          <li
                            key={topic}
                            className={`flex items-start gap-3 text-base ${bodyText}`}
                          >
                            <span
                              aria-hidden="true"
                              className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${dark ? "bg-ua-bg" : "bg-ua-ink"}`}
                            />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Video placeholder (compact so the card fits when stacked) */}
                      <div
                        className={`mt-6 flex h-36 w-full items-center justify-center rounded-2xl border-2 border-dashed ${borderText} ${labelText} md:h-40`}
                      >
                        <span className="px-4 text-center text-sm font-bold uppercase tracking-[0.15em]">
                          Day {day.n} tutorial — video slot
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <FinalCta />
    </>
  );
}

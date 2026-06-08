import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "About — Bridgeway AI Bootcamp",
  description:
    "Why Bridgeway AI Bootcamp exists: helping founders, teams and organisations build real websites with AI — without a CS degree or an agency invoice.",
};

const WHY = [
  {
    sticker: "cursor-star",
    color: "bg-ua-green",
    title: "it writes the code",
    body: "You describe what you want; AI builds it. You stay in control and learn as you go.",
  },
  {
    sticker: "lightning",
    color: "bg-ua-blue text-ua-bg",
    title: "it's the whole stack",
    body: "From front-end to database to payments — one workflow covers everything you need to ship.",
  },
  {
    sticker: "hundred",
    color: "bg-ua-orange",
    title: "it's a real skill",
    body: "Build for yourself, your team or for clients. People pay thousands for sites you'll learn to make.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="our mission"
        title="about bridgeway"
        intro="We believe anyone should be able to build the thing in their head — without a computer-science degree or a £10,000 agency invoice. AI changed what's possible. We teach you how to use it."
        sticker="sparkles"
      />

      {/* Instructor */}
      <section className="bg-ua-bg px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto w-full max-w-md">
              {/* TODO(owner): swap for a real instructor photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/marketing/placeholders/p2.png"
                alt=""
                aria-hidden="true"
                className="aspect-[4/5] w-full rounded-3xl border-2 border-ua-ink object-cover shadow-[8px_8px_0_var(--ua-ink)]"
              />
              <Sticker
                name="rock-on"
                size={104}
                rotate={-12}
                className="absolute -right-1 -top-6 z-10 md:-right-5 md:-top-7"
              />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-ua-ink/60">
                your instructor
              </p>
              <h2
                className="mt-3 text-4xl font-black lowercase tracking-tight text-ua-ink md:text-5xl"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                hi, i&apos;m your guide
              </h2>
            </Reveal>
            <Reveal>
              <p className="mt-6 text-lg text-ua-ink/80">
                I&apos;ve built and shipped dozens of websites and products using AI —
                for myself and for clients. I&apos;ll show you the exact, repeatable
                workflow I use, with no jargon and no gatekeeping.
              </p>
            </Reveal>
            <Reveal>
              <p className="mt-4 text-lg text-ua-ink/80">
                Over five days you&apos;ll learn the same stack real startups use: Cursor,
                Supabase, Stripe, Resend, GitHub, hosting, domains and SEO — all driven
                by AI.
              </p>
            </Reveal>
            <Reveal>
              <Link
                href="/syllabus"
                className="mt-8 inline-block font-bold text-ua-blue underline-offset-4 hover:underline"
              >
                See the syllabus →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why AI */}
      <section className="bg-ua-bg px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2
              className="text-center text-4xl font-bold lowercase text-ua-ink md:text-6xl"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              why ai?
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {WHY.map((w) => {
              const dark = w.color.includes("text-ua-bg");
              return (
                <Reveal key={w.title}>
                  <div
                    className={`relative h-full rounded-3xl border-2 border-ua-ink ${w.color} px-6 pb-8 pt-12 shadow-[6px_6px_0_var(--ua-ink)]`}
                  >
                    <Sticker
                      name={w.sticker}
                      size={72}
                      rotate={8}
                      className="absolute -right-3 -top-7"
                    />
                    <h3
                      className="text-2xl font-bold lowercase"
                      style={{ fontFamily: "var(--font-epilogue)" }}
                    >
                      {w.title}
                    </h3>
                    <p className={`mt-3 text-lg ${dark ? "text-ua-bg/90" : "text-ua-ink/80"}`}>
                      {w.body}
                    </p>
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

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

      {/* The team */}
      <section className="bg-ua-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ua-ink/60">
              the team
            </p>
            <h2
              className="relative mt-3 inline-block text-4xl font-black tracking-tight text-ua-ink md:text-5xl"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              You&apos;re learning from a team that ships
              <Sticker
                name="rock-on"
                size={92}
                rotate={-12}
                className="absolute -right-8 -top-9 z-10 hidden sm:block md:-right-16 md:-top-10"
              />
            </h2>
          </Reveal>
          <Reveal>
            <p className="mt-6 text-lg text-ua-ink/80">
              Bridgeway is a team of professional developers and designers with
              extensive, hands-on experience building with AI. We work in the
              modern AI stack every day — Cursor, Supabase, Stripe, Resend,
              GitHub, hosting, domains and SEO — to design, build and ship real
              products.
            </p>
          </Reveal>
          <Reveal>
            <p className="mt-4 text-lg text-ua-ink/80">
              Between us we&apos;ve shipped a wide portfolio of premium websites
              and apps for founders, businesses, charities and organisations. In
              the bootcamp we teach the exact, repeatable workflow we use in that
              work — no jargon, no gatekeeping.
            </p>
          </Reveal>
          <Reveal>
            <ul className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                { label: "AI-first development", color: "bg-ua-green" },
                { label: "Premium websites shipped", color: "bg-ua-pink" },
                { label: "Founders & teams trained", color: "bg-ua-sky" },
              ].map((tag) => (
                <li
                  key={tag.label}
                  className={`rounded-full border-2 border-ua-ink ${tag.color} px-5 py-2 text-sm font-bold text-ua-ink shadow-[3px_3px_0_var(--ua-ink)]`}
                >
                  {tag.label}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <Link
              href="/syllabus"
              className="mt-10 inline-block font-bold text-ua-blue underline-offset-4 hover:underline"
            >
              See the syllabus →
            </Link>
          </Reveal>
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

import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { FinalCta } from "@/components/marketing/sections/FinalCta";
import { HERO } from "@/lib/marketing/content";

export const metadata: Metadata = {
  title: "Pricing — Bridgeway AI Bootcamp",
  description:
    "One simple price for the full Bridgeway AI Bootcamp: 5 live sessions, lifetime access to recordings, the complete curriculum and the support to launch a real website.",
};

const INCLUDED = [
  "5 live 1-hour Zoom sessions",
  "Lifetime access to all recordings",
  "The full 12-topic curriculum",
  "Student dashboard to rewatch lessons",
  "Ask-anything Q&A support",
  "Templates, prompts & resources",
  "A real, live website by the end",
];

const TESTIMONIALS = [
  {
    color: "bg-ua-sky",
    quote:
      "I went from zero coding to a live booking site for my salon in a week. I still can't believe I built it myself.",
    name: "Maya R.",
    role: "Salon owner",
  },
  {
    color: "bg-ua-green",
    quote:
      "The Stripe and Supabase days alone paid for the course. I launched my SaaS and got my first paying user the next month.",
    name: "Daniel K.",
    role: "Indie founder",
  },
  {
    color: "bg-ua-pink",
    quote:
      "I now build websites for local businesses as a side hustle. £1,200 per client, built with AI.",
    name: "Priya S.",
    role: "Freelancer",
  },
];

const QUESTIONS = [
  "Do I need any coding experience?",
  "What if I miss a live session?",
  "How long do I keep access?",
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="one simple price"
        title="pricing"
        intro="Everything you need to learn to build and launch real websites with AI."
        sticker="hundred"
      />

      {/* Pricing card */}
      <section className="bg-ua-bg px-6 py-24 md:px-10">
        <div className="mx-auto max-w-md">
          <Reveal>
            <div className="relative rounded-3xl border-2 border-ua-ink bg-white px-7 pb-9 pt-12 shadow-[6px_6px_0_var(--ua-ink)]">
              <Sticker
                name="lets-go"
                size={96}
                rotate={10}
                className="absolute -right-4 -top-8 z-10"
              />

              <h2
                className="text-3xl font-bold lowercase text-ua-ink"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                full course
              </h2>

              <p
                className="mt-5 text-6xl font-black text-ua-ink md:text-7xl"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                £1,000
              </p>
              <p className="mt-2 text-sm font-bold uppercase tracking-[0.15em] text-ua-ink/60">
                one-time payment · lifetime access
              </p>

              <ul className="mt-8 space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-ua-ink/80">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ua-green text-xs font-black text-ua-ink"
                    >
                      ✓
                    </span>
                    <span className="text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={HERO.ctaHref}
                className="mt-9 block rounded-full bg-ua-orange px-7 py-3 text-center text-lg font-bold text-ua-bg hover:opacity-90"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                {HERO.ctaLabel} →
              </Link>

              <p className="mt-5 text-center text-sm text-ua-ink/60">
                Secure checkout via Stripe. 14-day money-back guarantee.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-ua-bg px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2
              className="text-center text-4xl font-bold lowercase text-ua-ink md:text-6xl"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              what students say
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Reveal key={t.name}>
                <figure
                  className={`flex h-full flex-col rounded-3xl border-2 border-ua-ink ${t.color} px-6 pb-7 pt-8 shadow-[6px_6px_0_var(--ua-ink)]`}
                >
                  <blockquote className="text-lg text-ua-ink/80">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6">
                    <span
                      className="block font-bold lowercase text-ua-ink"
                      style={{ fontFamily: "var(--font-epilogue)" }}
                    >
                      {t.name}
                    </span>
                    <span className="text-sm text-ua-ink/60">{t.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Common questions */}
      <section className="bg-ua-bg px-6 pb-24 md:px-10">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2
              className="text-4xl font-bold lowercase text-ua-ink md:text-5xl"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              common questions
            </h2>
          </Reveal>
          <Reveal>
            <ul className="mt-10 divide-y-2 divide-ua-ink/10 border-y-2 border-ua-ink/10">
              {QUESTIONS.map((q) => (
                <li
                  key={q}
                  className="py-5 text-lg font-bold text-ua-ink"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {q}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal>
            <Link
              href="/faq"
              className="mt-8 inline-block font-bold text-ua-blue underline-offset-4 hover:underline"
            >
              See all FAQs →
            </Link>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

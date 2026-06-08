import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { FinalCta } from "@/components/marketing/sections/FinalCta";

export const metadata: Metadata = {
  title: "FAQ — Bridgeway AI Bootcamp",
  description:
    "Answers to common questions about Bridgeway AI Bootcamp — experience needed, what's included, live sessions, recordings, access, and our money-back guarantee.",
};

const FAQS = [
  {
    q: "Do I need any coding experience?",
    a: "None at all. Bridgeway AI Bootcamp is built for complete beginners as well as people who already build. AI writes the code — you learn how to direct it.",
  },
  {
    q: "What exactly do I get?",
    a: "Five live 1-hour Zoom sessions, lifetime access to every recording, the full 12-topic curriculum, a student dashboard to rewatch lessons, Q&A support, and templates and prompts to reuse.",
  },
  {
    q: "When are the live sessions?",
    a: "The course runs over five consecutive days, one hour per day, live on Zoom. Dates for the next cohort are shown at checkout.",
  },
  {
    q: "What if I miss a session?",
    a: "No problem — every session is recorded and added to your dashboard within hours, so you can catch up and rewatch anytime.",
  },
  {
    q: "What will I be able to build?",
    a: "A real, live website with a database, payments, emails, a custom domain and SEO — the same stack used by real startups.",
  },
  {
    q: "What do I need to start?",
    a: "A laptop, an internet connection, and an AI account. We'll walk you through any other tools (all have free tiers to start).",
  },
  {
    q: "How long do I keep access?",
    a: "Forever. Lifetime access to all recordings and resources is included.",
  },
  {
    q: "Is there a guarantee?",
    a: "Yes — a 14-day money-back guarantee. If it's not for you, email us for a full refund.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero eyebrow="questions?" title="frequently asked" sticker="peace" />

      {/* FAQ accordion */}
      <section className="relative overflow-hidden bg-ua-bg px-6 py-24 md:px-10">
        <Sticker
          name="sparkles"
          size={96}
          rotate={-12}
          className="absolute left-6 top-16 hidden lg:block"
        />
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="flex flex-col gap-4">
              {FAQS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border-2 border-ua-ink bg-white px-6 py-5 shadow-[4px_4px_0_var(--ua-ink)]"
                >
                  <summary
                    className="flex list-none cursor-pointer items-center justify-between gap-4 font-bold text-ua-ink"
                    style={{ fontFamily: "var(--font-epilogue)" }}
                  >
                    <span>{item.q}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-2xl leading-none text-ua-blue transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-ua-ink/80">{item.a}</p>
                </details>
              ))}
            </div>
          </Reveal>

          {/* Still unsure */}
          <Reveal>
            <div className="mt-12 text-center">
              <p
                className="text-2xl font-bold lowercase text-ua-ink"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                still unsure?
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-block font-bold text-ua-blue underline-offset-4 hover:underline"
              >
                Get in touch →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

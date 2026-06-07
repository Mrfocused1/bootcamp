import Link from "next/link";
import { getCohort } from "@/lib/queries";
import { CountdownBanner } from "@/components/CountdownBanner";

// ── Mock constants ────────────────────────────────────────────────────────────
const TOTAL_SEATS = 20;
const SEATS_LEFT = 6;

// ── Feature list ──────────────────────────────────────────────────────────────
const FEATURES = [
  "5 live 1-hour Zoom sessions",
  "Lifetime access to all recordings",
  "Full 12-topic curriculum incl. Cursor",
  "Student dashboard to rewatch lessons",
  "AI assistant for questions",
  "Templates, prompts & resources",
  "A real, live website by the end",
];

// ── Short testimonials ────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    quote: "I went from zero to a working booking site in a week. I still can't believe I built it myself.",
    name: "Maya R.",
    title: "Salon owner",
    accent: "var(--ua-sky)",
  },
  {
    id: 2,
    quote: "The Stripe and Supabase days alone paid for the course. First paying user the next month.",
    name: "Daniel K.",
    title: "Indie founder",
    accent: "var(--ua-pink)",
  },
  {
    id: 3,
    quote: "I now build sites for local businesses as a side hustle. Built with AI, every time.",
    name: "Priya S.",
    title: "Freelancer",
    accent: "var(--ua-green)",
  },
];

// ── Short FAQ items ───────────────────────────────────────────────────────────
const FAQ_TEASER = [
  {
    q: "Do I need any coding experience?",
    a: "No. AI does the heavy lifting — you learn how to direct it.",
  },
  {
    q: "What if I miss a live session?",
    a: "Every session is recorded and added to your dashboard within hours.",
  },
  {
    q: "How long do I keep access?",
    a: "Forever. Lifetime access to all recordings and resources is included.",
  },
];

export default async function PricingPage() {
  const cohort = await getCohort();

  return (
    <div className="space-y-0">
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--ua-bg)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Eyebrow pill */}
          <div className="mb-6">
            <span
              className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "var(--ua-orange)", color: "var(--ua-ink)" }}
            >
              one simple price
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold lowercase leading-[1.05] tracking-tight"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "var(--ua-ink)",
            }}
          >
            pricing
          </h1>
          <p
            className="mt-6 text-lg sm:text-xl leading-relaxed max-w-xl"
            style={{ color: "var(--ua-ink)", opacity: 0.65 }}
          >
            Everything you need to learn to build and launch real websites with AI —
            one payment, no subscriptions, lifetime access.
          </p>
        </div>
      </section>

      {/* ── COUNTDOWN BANNER ────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <CountdownBanner
          startDate={cohort.start_date}
          seats={TOTAL_SEATS}
          seatsLeft={SEATS_LEFT}
        />
      </section>

      {/* ── PRICE CARD ──────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-lg">
            <div
              className="rounded-3xl p-8 sm:p-10 flex flex-col gap-6"
              style={{ backgroundColor: "var(--ua-bg)", border: "2px solid var(--ua-ink)" }}
            >
              {/* Course pill */}
              <div>
                <span
                  className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
                  style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
                >
                  Full course
                </span>
              </div>

              {/* Price */}
              <div>
                <p
                  className="text-6xl font-bold leading-none"
                  style={{
                    fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                    color: "var(--ua-ink)",
                  }}
                >
                  £1,000
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
                  one-time payment · lifetime access
                </p>
              </div>

              {/* Feature list */}
              <ul className="flex flex-col gap-2.5">
                {FEATURES.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ backgroundColor: "var(--ua-green)", color: "var(--ua-ink)" }}
                    >
                      ✓
                    </span>
                    <span className="text-sm leading-snug" style={{ color: "var(--ua-ink)" }}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="STRIPE_PAYMENT_LINK_HERE"
                className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold transition-opacity hover:opacity-85"
                style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
              >
                Get my spot →
              </a>

              {/* Payment plan note */}
              <p className="text-sm text-center" style={{ color: "var(--ua-ink)", opacity: 0.6 }}>
                Prefer to spread it out? Pay in 3&times; £334 interest-free.
              </p>

              {/* Guarantee */}
              <div
                className="rounded-2xl px-5 py-4 flex flex-col gap-1"
                style={{ backgroundColor: "var(--ua-ink)", color: "#fff" }}
              >
                <p className="text-sm font-semibold">14-day money-back guarantee</p>
                <p className="text-xs" style={{ opacity: 0.6 }}>
                  Secure checkout via Stripe. Not for you? Email us for a full refund.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: "var(--ua-bg)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-blue)" }}
            >
              Social proof
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold lowercase"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              what students say
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ id, quote, name, title, accent }) => (
              <div
                key={id}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ backgroundColor: accent }}
              >
                <p
                  className="text-base leading-relaxed font-medium"
                  style={{ color: "var(--ua-ink)" }}
                >
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="mt-auto">
                  <p className="text-sm font-bold" style={{ color: "var(--ua-ink)" }}>
                    {name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--ua-ink)", opacity: 0.6 }}>
                    {title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ TEASER ──────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-blue)" }}
            >
              Common questions
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold lowercase"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              quick answers
            </h2>
          </div>

          <div className="flex flex-col divide-y" style={{ borderColor: "var(--ua-ink)", opacity: 1 }}>
            {FAQ_TEASER.map(({ q, a }) => (
              <details
                key={q}
                className="group py-4"
                style={{ borderColor: "rgba(20,20,20,0.12)" }}
              >
                <summary
                  className="flex items-center justify-between cursor-pointer list-none text-base font-semibold select-none"
                  style={{ color: "var(--ua-ink)" }}
                >
                  {q}
                  <span
                    className="ml-4 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-transform group-open:rotate-45"
                    style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.65 }}>
                  {a}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/faq"
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--ua-blue)" }}
            >
              See all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section
        className="py-20 sm:py-28"
        style={{ backgroundColor: "var(--ua-ink)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <span
            className="font-genty text-6xl sm:text-7xl leading-none"
            style={{ color: "var(--ua-blue)" }}
          >
            Urban AI
          </span>
          <h2
            className="mt-6 text-3xl sm:text-5xl font-bold lowercase"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "#fff",
            }}
          >
            ready to start building?
          </h2>
          <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto" style={{ color: "#fff", opacity: 0.6 }}>
            {SEATS_LEFT} spots left in the next cohort. Secure your place today.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <a
              href="STRIPE_PAYMENT_LINK_HERE"
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Get my spot →
            </a>
            <Link
              href="/syllabus"
              className="inline-flex items-center justify-center rounded-full border-2 px-8 py-3.5 text-base font-semibold transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
            >
              See the full syllabus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

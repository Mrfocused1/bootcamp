import Link from "next/link";
import { getCohort } from "@/lib/queries";
import { CountdownBanner } from "@/components/CountdownBanner";

// ── Mock seat constants ──────────────────────────────────────────────────────
const TOTAL_SEATS = 20;
const SEATS_LEFT = 6;

// ── Day curriculum ───────────────────────────────────────────────────────────
const DAYS = [
  {
    index: 1,
    title: "Build the look",
    description: "Clone any website, generate AI images, and set up your dev environment with Cursor.",
    topics: ["Cursor", "AI images (ChatGPT)", "Cloning websites", "Voice coding (Whisper)"],
    accent: "var(--ua-sky)",
  },
  {
    index: 2,
    title: "Make it real",
    description: "Connect your project to a real database and version control.",
    topics: ["Supabase", "GitHub"],
    accent: "var(--ua-green)",
  },
  {
    index: 3,
    title: "Get paid & connected",
    description: "Integrate payments, transactional email, and CRM basics.",
    topics: ["Stripe", "Resend", "CRMs"],
    accent: "var(--ua-pink)",
  },
  {
    index: 4,
    title: "Launch it live",
    description: "Deploy to a real domain, debug production issues, and go live with confidence.",
    topics: ["Vercel", "Domains", "Debugging"],
    accent: "#f5e6c8",
  },
  {
    index: 5,
    title: "Get found & grow",
    description: "Master SEO fundamentals, set up analytics, and join our live Q&A session.",
    topics: ["SEO", "Analytics", "Live Q&A"],
    accent: "var(--ua-orange)",
  },
];

// ── Tools ────────────────────────────────────────────────────────────────────
const TOOLS = [
  "Cursor",
  "Supabase",
  "Stripe",
  "Resend",
  "GitHub",
  "ChatGPT",
  "Whisper",
  "Vercel",
];

// ── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    id: 1,
    quote: "I went from zero to a working SaaS in 5 days. The AI workflow they teach is genuinely game-changing.",
    name: "Jordan Lee",
    title: "Freelance designer",
    accent: "var(--ua-sky)",
  },
  {
    id: 2,
    quote: "I've tried Udemy, YouTube, bootcamps — nothing clicked until Urban AI. The pace is perfect and the tools are real.",
    name: "Sam Rivera",
    title: "Marketing manager",
    accent: "var(--ua-pink)",
  },
  {
    id: 3,
    quote: "Shipped my first client website the week after the course. Already paid for itself 10×.",
    name: "Casey Okonkwo",
    title: "Freelance consultant",
    accent: "var(--ua-green)",
  },
];

export default async function MarketingHomepage() {
  const cohort = await getCohort();

  return (
    <div className="space-y-0">
      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--ua-bg)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Eyebrow pill */}
          <div className="mb-6">
            <span
              className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              5-day live course
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold lowercase leading-[1.05] tracking-tight max-w-3xl"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "var(--ua-ink)",
            }}
          >
            build real websites with AI —{" "}
            <span style={{ color: "var(--ua-blue)" }}>in 5 days</span>
          </h1>

          {/* Subtext */}
          <p
            className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: "var(--ua-ink)", opacity: 0.65 }}
          >
            No code. Learn the exact AI workflow to build and launch a real website — with
            paying users, a real domain, and a live product you can show the world.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Start building →
            </Link>
            <Link
              href="/syllabus"
              className="inline-flex items-center justify-center rounded-full border-2 px-7 py-3 text-base font-semibold transition-colors hover:bg-[var(--ua-ink)] hover:text-[var(--ua-bg)]"
              style={{ borderColor: "var(--ua-ink)", color: "var(--ua-ink)" }}
            >
              See the syllabus
            </Link>
          </div>

          {/* Hero media placeholder */}
          {/* TODO: replace with hero video
          <div className="mt-12 rounded-3xl overflow-hidden aspect-video bg-black/10 max-w-4xl">
            <video src="/hero.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
          </div>
          */}

          {/* Decorative sticker pill */}
          <div className="mt-12 inline-flex items-center gap-2 rounded-full px-4 py-2"
            style={{ backgroundColor: "var(--ua-pink)" }}>
            <span className="text-sm font-semibold" style={{ color: "var(--ua-ink)" }}>
              Next cohort filling fast — {SEATS_LEFT} of {TOTAL_SEATS} spots left
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. URGENCY / COUNTDOWN BANNER ──────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <CountdownBanner
          startDate={cohort.start_date}
          seats={TOTAL_SEATS}
          seatsLeft={SEATS_LEFT}
        />
      </section>

      {/* ── 3. WHAT YOU'LL LEARN ────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: "#fff" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-blue)" }}
            >
              The curriculum
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold lowercase"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              what you'll learn
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DAYS.map((day) => (
              <div
                key={day.index}
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{ backgroundColor: day.accent }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "rgba(20,20,20,0.12)", color: "var(--ua-ink)" }}
                  >
                    {day.index}
                  </span>
                  <h3
                    className="font-bold text-lg lowercase"
                    style={{
                      fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                      color: "var(--ua-ink)",
                    }}
                  >
                    {day.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.72 }}>
                  {day.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                  {day.topics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: "rgba(20,20,20,0.1)", color: "var(--ua-ink)" }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* CTA card (6th slot) */}
            <div
              className="rounded-2xl p-5 flex flex-col gap-3 justify-between"
              style={{ backgroundColor: "var(--ua-blue)" }}
            >
              <p
                className="text-2xl font-bold lowercase"
                style={{
                  fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                  color: "#fff",
                }}
              >
                ready to build all of this?
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85"
                style={{ backgroundColor: "#fff", color: "var(--ua-blue)" }}
              >
                Start building →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. TOOLS YOU'LL MASTER ──────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: "var(--ua-bg)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-blue)" }}
            >
              The stack
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold lowercase"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              tools you'll master
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {TOOLS.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center rounded-full px-5 py-2.5 text-base font-semibold"
                style={{ backgroundColor: "#fff", color: "var(--ua-ink)" }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: "#fff" }}
      >
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

      {/* ── 6. FINAL CTA ────────────────────────────────────────────────────── */}
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
            ready to build?
          </h2>
          <p className="mt-4 text-base sm:text-lg max-w-xl mx-auto" style={{ color: "#fff", opacity: 0.6 }}>
            Join the next cohort and go from idea to live product in 5 days — with real tools,
            real AI, and a community that ships.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Get my spot →
            </Link>
            <Link
              href="/syllabus"
              className="inline-flex items-center justify-center rounded-full border-2 px-8 py-3.5 text-base font-semibold transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
            >
              See the full syllabus
            </Link>
          </div>
          <p className="mt-4 text-sm" style={{ color: "#fff", opacity: 0.4 }}>
            {SEATS_LEFT} spots left · Next cohort starts {cohort.start_date}
          </p>
        </div>
      </section>
    </div>
  );
}

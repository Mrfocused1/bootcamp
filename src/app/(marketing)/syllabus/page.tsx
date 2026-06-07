import Link from "next/link";

// ── Day data ──────────────────────────────────────────────────────────────────
const DAYS = [
  {
    index: 1,
    title: "Build the look",
    byEndOfDay: "You'll have a great-looking site on screen.",
    topics: ["Cursor", "Cloning websites", "AI images (ChatGPT)", "Voice coding (Whisper)"],
    bullets: [
      "Set up & build in Cursor",
      "Clone any website from a link",
      "Recreate a design from a screenshot",
      "Generate images with AI",
      "Voice-control your coding with Whisper",
    ],
    accent: "var(--ua-sky)",
  },
  {
    index: 2,
    title: "Make it real",
    byEndOfDay: "Your site stores and remembers real data.",
    topics: ["Supabase", "GitHub"],
    bullets: [
      "Databases with Supabase",
      "User sign-up & login",
      "Connect your front-end to the database",
      "Version control with GitHub",
    ],
    accent: "var(--ua-green)",
  },
  {
    index: 3,
    title: "Get paid & connected",
    byEndOfDay: "You can take money and talk to customers.",
    topics: ["Stripe", "Resend", "CRMs"],
    bullets: [
      "Payments with Stripe",
      "Transactional emails with Resend",
      "Set up a CRM",
      "Capture & manage leads",
    ],
    accent: "var(--ua-pink)",
  },
  {
    index: 4,
    title: "Launch it live",
    byEndOfDay: "Your site is live on the internet.",
    topics: ["Hosting", "Domains", "Debugging"],
    bullets: [
      "Hosting your site",
      "Connect a custom domain",
      "Go live to the world",
      "Debug like a pro",
    ],
    accent: "#f5e6c8",
  },
  {
    index: 5,
    title: "Get found & grow",
    byEndOfDay: "People can find you on Google.",
    topics: ["SEO", "Analytics", "Live Q&A"],
    bullets: [
      "SEO fundamentals",
      "Rank on Google",
      "Analytics & iteration",
      "Recap + live Q&A session",
    ],
    accent: "var(--ua-orange)",
  },
];

export default function SyllabusPage() {
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
              style={{ backgroundColor: "var(--ua-green)", color: "var(--ua-ink)" }}
            >
              5 days · 1 hour a day · live on Zoom
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold lowercase leading-[1.05] tracking-tight"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "var(--ua-ink)",
            }}
          >
            the syllabus
          </h1>
          <p
            className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: "var(--ua-ink)", opacity: 0.65 }}
          >
            Twelve essential skills across five focused one-hour live sessions.
            Every session is recorded, so you can rewatch any topic whenever you like.
          </p>

          <div className="mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Get my spot →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DAY CARDS ────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-5">
            {DAYS.map((day) => (
              <div
                key={day.index}
                className="rounded-2xl p-6 sm:p-8"
                style={{ backgroundColor: day.accent }}
              >
                <div className="flex flex-col sm:flex-row sm:gap-8">
                  {/* Day number */}
                  <div className="flex-shrink-0 mb-4 sm:mb-0">
                    <span
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold"
                      style={{ backgroundColor: "rgba(20,20,20,0.12)", color: "var(--ua-ink)" }}
                    >
                      {day.index}
                    </span>
                  </div>

                  <div className="flex-1">
                    {/* Session label */}
                    <div className="mb-2">
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: "rgba(20,20,20,0.1)", color: "var(--ua-ink)" }}
                      >
                        Day {day.index} · 1 hour live
                      </span>
                    </div>

                    <h2
                      className="text-2xl sm:text-3xl font-bold lowercase"
                      style={{
                        fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                        color: "var(--ua-ink)",
                      }}
                    >
                      {day.title}
                    </h2>

                    {/* By end of day */}
                    <p
                      className="mt-2 text-sm font-semibold"
                      style={{ color: "var(--ua-ink)", opacity: 0.7 }}
                    >
                      By the end of day {day.index}: {day.byEndOfDay}
                    </p>

                    {/* Bullets */}
                    <ul className="mt-4 flex flex-col gap-1.5">
                      {day.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: "var(--ua-ink)" }}
                        >
                          <span className="mt-0.5 flex-shrink-0" style={{ opacity: 0.5 }}>–</span>
                          {b}
                        </li>
                      ))}
                    </ul>

                    {/* Topic pills */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
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

                    {/* Video placeholder */}
                    {/* TODO: replace with embedded session recording */}
                    <div
                      className="mt-5 rounded-xl aspect-video flex items-center justify-center text-sm"
                      style={{ backgroundColor: "rgba(20,20,20,0.08)", color: "var(--ua-ink)", opacity: 0.45 }}
                    >
                      Day {day.index} recorded session — video slot
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            ready to build?
          </h2>
          <p
            className="mt-4 text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: "#fff", opacity: 0.6 }}
          >
            Join the next cohort and ship your first real website with AI in 5 days.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Get my spot →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

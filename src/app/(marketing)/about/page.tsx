import Link from "next/link";

// ── "Why AI?" cards ───────────────────────────────────────────────────────────
const WHY_AI = [
  {
    title: "It writes the code",
    body: "You describe what you want; AI builds it. You stay in control and learn as you go — no degree required.",
    accent: "var(--ua-sky)",
  },
  {
    title: "It's the whole stack",
    body: "From front-end to database to payments — one AI workflow covers everything you need to ship a real product.",
    accent: "var(--ua-green)",
  },
  {
    title: "It's a real skill",
    body: "Build for yourself, or for clients. People are paying thousands for sites you'll learn to make in five days.",
    accent: "var(--ua-pink)",
  },
];

export default function AboutPage() {
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
              our mission
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold lowercase leading-[1.05] tracking-tight max-w-3xl"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "var(--ua-ink)",
            }}
          >
            about urban ai
          </h1>
          <p
            className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: "var(--ua-ink)", opacity: 0.65 }}
          >
            We believe anyone should be able to build the thing in their head —
            without a computer-science degree or a £10,000 agency invoice.
            AI changed what&rsquo;s possible. We teach you how to use it.
          </p>
        </div>
      </section>

      {/* ── INSTRUCTOR ───────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 items-center">
            {/* Photo placeholder */}
            {/* TODO: replace with real instructor photo */}
            <div
              className="rounded-3xl aspect-square flex items-center justify-center text-sm"
              style={{ backgroundColor: "var(--ua-bg)", color: "var(--ua-ink)", opacity: 0.4 }}
            >
              instructor photo — image slot
            </div>

            {/* Bio */}
            <div>
              <div className="mb-4">
                <span
                  className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
                  style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
                >
                  your instructor
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl font-bold lowercase"
                style={{
                  fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                  color: "var(--ua-ink)",
                }}
              >
                hi, i&rsquo;m your guide
              </h2>

              {/* TODO: replace with real instructor bio */}
              <p
                className="mt-5 text-base leading-relaxed"
                style={{ color: "var(--ua-ink)", opacity: 0.7 }}
              >
                I&rsquo;ve built and shipped dozens of websites and products using AI —
                for myself and for clients. I&rsquo;ll show you the exact, repeatable
                workflow I use every day, with no jargon and no gatekeeping.
              </p>
              <p
                className="mt-4 text-base leading-relaxed"
                style={{ color: "var(--ua-ink)", opacity: 0.7 }}
              >
                Over five days you&rsquo;ll learn the same stack real startups use:
                Cursor, Supabase, Stripe, Resend, GitHub, hosting, domains and SEO —
                all driven by AI.
              </p>

              <div className="mt-6">
                <Link
                  href="/syllabus"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "var(--ua-ink)", color: "#fff" }}
                >
                  See the syllabus →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY AI? ──────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: "var(--ua-bg)" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 space-y-2 text-center">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-blue)" }}
            >
              The case for AI
            </p>
            <h2
              className="text-3xl sm:text-4xl font-bold lowercase"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              why ai?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {WHY_AI.map(({ title, body, accent }) => (
              <div
                key={title}
                className="rounded-2xl p-6 flex flex-col gap-3"
                style={{ backgroundColor: accent }}
              >
                <h3
                  className="text-xl font-bold lowercase"
                  style={{
                    fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                    color: "var(--ua-ink)",
                  }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.72 }}>
                  {body}
                </p>
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
            Join the next cohort and go from idea to live product in 5 days.
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
        </div>
      </section>
    </div>
  );
}

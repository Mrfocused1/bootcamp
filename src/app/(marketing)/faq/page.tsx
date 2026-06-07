import Link from "next/link";

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "Do I need any coding experience?",
    a: "None at all. Urban AI is built for complete beginners as well as people who already build. AI writes the code — you learn how to direct it.",
  },
  {
    q: "What exactly do I get?",
    a: "Five live 1-hour Zoom sessions, lifetime access to every recording, the full 12-topic curriculum, a student dashboard to rewatch lessons, Q&A support, and templates and prompts to reuse on any future project.",
  },
  {
    q: "When are the live sessions?",
    a: "The course runs over five consecutive days, one hour per day, live on Zoom. Dates for the next cohort are shown at checkout.",
  },
  {
    q: "What if I miss a live session?",
    a: "No problem — every session is recorded and added to your dashboard within hours, so you can catch up and rewatch anytime.",
  },
  {
    q: "What will I be able to build?",
    a: "A real, live website with a database, payments, transactional emails, a custom domain and SEO — the same stack used by real startups and freelancers.",
  },
  {
    q: "What do I need to get started?",
    a: "A laptop, an internet connection, and an AI account (ChatGPT free tier is fine to start). We'll walk you through any other tools — all have free tiers to get going.",
  },
  {
    q: "How long do I keep access?",
    a: "Forever. Lifetime access to all recordings and resources is included — no subscriptions, no expiry.",
  },
  {
    q: "Is there a guarantee?",
    a: "Yes — a 14-day money-back guarantee. If the course isn't right for you, email us within 14 days for a full refund.",
  },
];

export default function FaqPage() {
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
              questions?
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold lowercase leading-[1.05] tracking-tight"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "var(--ua-ink)",
            }}
          >
            frequently asked
          </h1>
        </div>
      </section>

      {/* ── ACCORDION ────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col">
            {FAQS.map(({ q, a }, i) => (
              <details
                key={i}
                className="group border-b py-5"
                style={{ borderColor: "rgba(20,20,20,0.12)" }}
              >
                <summary
                  className="flex items-center justify-between cursor-pointer list-none text-base font-semibold select-none gap-4"
                  style={{ color: "var(--ua-ink)" }}
                >
                  <span>{q}</span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-transform duration-200 group-open:rotate-45"
                    style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
                  >
                    +
                  </span>
                </summary>
                <p
                  className="mt-4 text-base leading-relaxed"
                  style={{ color: "var(--ua-ink)", opacity: 0.65 }}
                >
                  {a}
                </p>
              </details>
            ))}
          </div>

          {/* Still unsure? */}
          <p className="mt-10 text-base" style={{ color: "var(--ua-ink)", opacity: 0.65 }}>
            Still unsure?{" "}
            <Link
              href="/contact"
              className="font-semibold underline underline-offset-2 transition-opacity hover:opacity-70"
              style={{ color: "var(--ua-ink)" }}
            >
              Get in touch →
            </Link>
          </p>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────────── */}
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
            ready when you are
          </h2>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full px-8 py-3.5 text-base font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Get my spot →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border-2 px-8 py-3.5 text-base font-semibold transition-colors hover:bg-white/10"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

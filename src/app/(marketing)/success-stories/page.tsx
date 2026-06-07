import Link from "next/link";

// ── Student story data ────────────────────────────────────────────────────────
const STORIES = [
  {
    id: 1,
    name: "Maya R.",
    category: "Apps",
    categoryAccent: "var(--ua-sky)",
    title: "AI meal-planning app",
    result: "Launched in 7 days, now 300+ users",
    quote: "I went from zero coding to a live app for my meal-planning side hustle in a week. I still can't believe I built it myself.",
  },
  {
    id: 2,
    name: "Daniel K.",
    category: "Stores",
    categoryAccent: "var(--ua-green)",
    title: "Coffee subscription store",
    result: "First paying customer in week one",
    quote: "The Stripe and Supabase days alone paid for the course. I launched my store and got my first paying customer the next month.",
  },
  {
    id: 3,
    name: "Priya S.",
    category: "Apps",
    categoryAccent: "var(--ua-orange)",
    title: "Online tutoring platform",
    result: "Replaced a £6k agency quote",
    quote: "I was quoted £6,000 by an agency. I built the same thing myself in 5 days after the course.",
  },
  {
    id: 4,
    name: "Leah M.",
    category: "Stores",
    categoryAccent: "var(--ua-sky)",
    title: "Handmade jewellery shop",
    result: "£2k in sales the first month",
    quote: "I'd always wanted to sell online but it felt impossible without tech skills. Urban AI made it completely doable.",
  },
  {
    id: 5,
    name: "Marcus O.",
    category: "Booking",
    categoryAccent: "var(--ua-blue)",
    title: "Barber booking site",
    result: "Fully booked weekends now",
    quote: "My weekends are booked solid now. I built the booking system myself — it's exactly what I needed.",
  },
  {
    id: 6,
    name: "Tom B.",
    category: "Sites",
    categoryAccent: "var(--ua-green)",
    title: "Author portfolio",
    result: "Landed a publishing deal",
    quote: "A professional portfolio site was the one thing missing. I built it in Day 1 and had a publishing enquiry within the week.",
  },
  {
    id: 7,
    name: "Sara D.",
    category: "Sites",
    categoryAccent: "var(--ua-orange)",
    title: "Fitness coaching site",
    result: "Sells programmes on autopilot",
    quote: "I now sell my fitness programmes on autopilot — Stripe handles payments, Resend sends the emails. It just works.",
  },
  {
    id: 8,
    name: "Hassan A.",
    category: "Booking",
    categoryAccent: "var(--ua-blue)",
    title: "Restaurant ordering site",
    result: "Cut commission fees to zero",
    quote: "We were paying a 30% commission to delivery platforms. Now we take orders directly — zero fees.",
  },
  {
    id: 9,
    name: "Nina P.",
    category: "Apps",
    categoryAccent: "var(--ua-pink)",
    title: "SaaS dashboard",
    result: "Bootstrapped to first revenue",
    quote: "I had the idea for two years. Five days after joining Urban AI, I had a working product. First revenue the following week.",
  },
];

export default function SuccessStoriesPage() {
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
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              real students · real websites
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold lowercase leading-[1.05] tracking-tight"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "var(--ua-ink)",
            }}
          >
            success stories
          </h1>
          <p
            className="mt-6 text-lg sm:text-xl leading-relaxed max-w-2xl"
            style={{ color: "var(--ua-ink)", opacity: 0.65 }}
          >
            From total beginners to live, money-making websites. Here&rsquo;s what our
            students have built with AI.
          </p>
        </div>
      </section>

      {/* ── STORY GRID ───────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {STORIES.map((story) => (
              <div
                key={story.id}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ backgroundColor: "var(--ua-bg)" }}
              >
                {/* Image placeholder */}
                {/* TODO: replace with actual student site screenshot */}
                <div
                  className="rounded-xl aspect-video flex items-center justify-center text-xs"
                  style={{ backgroundColor: "rgba(20,20,20,0.06)", color: "var(--ua-ink)", opacity: 0.4 }}
                >
                  {story.title} — screenshot
                </div>

                {/* Name + category pill */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold" style={{ color: "var(--ua-ink)" }}>
                    {story.name}
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: story.categoryAccent, color: "var(--ua-ink)" }}
                  >
                    {story.category}
                  </span>
                </div>

                <div>
                  <h2
                    className="text-lg font-bold lowercase"
                    style={{
                      fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                      color: "var(--ua-ink)",
                    }}
                  >
                    {story.title}
                  </h2>
                  <p className="mt-1 text-sm font-semibold" style={{ color: "var(--ua-ink)", opacity: 0.6 }}>
                    {story.result}
                  </p>
                </div>

                <p
                  className="text-sm leading-relaxed flex-1"
                  style={{ color: "var(--ua-ink)", opacity: 0.75 }}
                >
                  &ldquo;{story.quote}&rdquo;
                </p>

                {/* View site placeholder */}
                {/* TODO: replace # with actual student site URL */}
                <a
                  href="#"
                  className="inline-flex items-center text-sm font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "var(--ua-blue)" }}
                >
                  View site →
                </a>
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
            you could be next
          </h2>
          <p
            className="mt-4 text-base sm:text-lg max-w-xl mx-auto"
            style={{ color: "#fff", opacity: 0.6 }}
          >
            Join the next cohort and build something real.
          </p>
          <div className="mt-8">
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

import Link from "next/link";

// ── Socials ───────────────────────────────────────────────────────────────────
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/urbanai" },
  { label: "TikTok", href: "https://tiktok.com/@urbanai" },
  { label: "LinkedIn", href: "https://linkedin.com/company/urbanai" },
];

export default function ContactPage() {
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
              say hello
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold lowercase leading-[1.05] tracking-tight"
            style={{
              fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
              color: "var(--ua-ink)",
            }}
          >
            contact
          </h1>
          <p
            className="mt-6 text-lg sm:text-xl leading-relaxed max-w-xl"
            style={{ color: "var(--ua-ink)", opacity: 0.65 }}
          >
            Questions before you enrol? We&rsquo;d love to help.
          </p>
        </div>
      </section>

      {/* ── CONTACT BODY ─────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16" style={{ backgroundColor: "#fff" }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16">
            {/* Left: email + socials */}
            <div className="flex flex-col gap-8">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--ua-ink)", opacity: 0.45 }}
                >
                  Email
                </p>
                <a
                  href="mailto:hello@urbanai.co"
                  className="text-lg font-bold transition-opacity hover:opacity-70"
                  style={{ color: "var(--ua-blue)" }}
                >
                  hello@urbanai.co
                </a>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--ua-ink)", opacity: 0.45 }}
                >
                  Social
                </p>
                <ul className="flex flex-col gap-2">
                  {SOCIALS.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-semibold transition-opacity hover:opacity-70"
                        style={{ color: "var(--ua-ink)" }}
                      >
                        {label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.5 }}>
                We&rsquo;re online — reply times are usually within a day.
              </p>
            </div>

            {/* Right: contact form */}
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ backgroundColor: "var(--ua-bg)" }}
            >
              <h2
                className="text-xl font-bold lowercase mb-6"
                style={{
                  fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                  color: "var(--ua-ink)",
                }}
              >
                send a message
              </h2>

              {/* TODO: real handler — currently posts via mailto fallback */}
              <form
                action="mailto:hello@urbanai.co"
                method="post"
                encType="text/plain"
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                  >
                    Your name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Jane Smith"
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
                    style={{
                      backgroundColor: "#fff",
                      color: "var(--ua-ink)",
                      border: "1.5px solid rgba(20,20,20,0.15)",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                  >
                    Your email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="jane@example.com"
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ua-blue)]"
                    style={{
                      backgroundColor: "#fff",
                      color: "var(--ua-ink)",
                      border: "1.5px solid rgba(20,20,20,0.15)",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                  >
                    Your message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Tell us what's on your mind…"
                    rows={4}
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ua-blue)] resize-none"
                    style={{
                      backgroundColor: "#fff",
                      color: "var(--ua-ink)",
                      border: "1.5px solid rgba(20,20,20,0.15)",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold transition-opacity hover:opacity-85"
                  style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
                >
                  Send →
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ───────────────────────────────────────────────────────── */}
      <section
        className="py-16 sm:py-20"
        style={{ backgroundColor: "var(--ua-bg)" }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p
              className="text-2xl font-bold lowercase"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              ready to start building?
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
              See what the course covers first.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full px-7 py-3 text-base font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Get my spot →
            </Link>
            <Link
              href="/syllabus"
              className="inline-flex items-center justify-center rounded-full border-2 px-7 py-3 text-base font-semibold transition-colors hover:bg-[var(--ua-ink)] hover:text-[var(--ua-bg)]"
              style={{ borderColor: "var(--ua-ink)", color: "var(--ua-ink)" }}
            >
              See the syllabus
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

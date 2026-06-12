import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { FinalCta } from "@/components/marketing/sections/FinalCta";
import { SHOW_SOCIALS, SITE, SOCIALS } from "@/lib/marketing/content";

export const metadata: Metadata = {
  title: "Contact — Bridgeway AI Bootcamp",
  description:
    "Got questions before you enrol on the Bridgeway AI Bootcamp? Email us or reach out on social — we usually reply within a day.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="say hello"
        title="contact"
        intro="Questions before you enrol? We'd love to help."
        sticker="phone-hand"
      />

      <section className="bg-ua-bg px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          {/* LEFT — contact info */}
          <Reveal>
            <div className="relative">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-ua-ink/60">
                email
              </p>
              <a
                href={`mailto:${SITE.email}`}
                className="mt-2 inline-block text-xl font-bold text-ua-ink hover:text-ua-blue"
              >
                {SITE.email}
              </a>

              {SHOW_SOCIALS && (
                <>
                  <p className="mt-10 text-sm font-bold uppercase tracking-[0.2em] text-ua-ink/60">
                    social
                  </p>
                  <ul className="mt-2 space-y-2">
                    {SOCIALS.map((s) => (
                      <li key={s.label}>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xl font-bold text-ua-ink hover:text-ua-blue"
                        >
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <p className="mt-10 max-w-sm text-lg text-ua-ink/80">
                We&apos;re online — reply times are usually within a day.
              </p>

              <Sticker
                name="heart-hands"
                size={104}
                rotate={-10}
                className="mt-8 hidden md:block"
              />
            </div>
          </Reveal>

          {/* RIGHT — send a message card */}
          <Reveal>
            <div
              id="contact-form"
              className="scroll-mt-28 rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)] md:p-8"
            >
              <h2
                className="text-3xl font-bold lowercase text-ua-ink md:text-4xl"
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                send a message
              </h2>

              <div className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="text-sm font-bold uppercase tracking-[0.2em] text-ua-ink/60"
                  >
                    name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    className="mt-2 w-full rounded-xl border-2 border-ua-ink bg-ua-bg px-4 py-3 text-ua-ink"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="text-sm font-bold uppercase tracking-[0.2em] text-ua-ink/60"
                  >
                    email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    className="mt-2 w-full rounded-xl border-2 border-ua-ink bg-ua-bg px-4 py-3 text-ua-ink"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="text-sm font-bold uppercase tracking-[0.2em] text-ua-ink/60"
                  >
                    message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    className="mt-2 w-full rounded-xl border-2 border-ua-ink bg-ua-bg px-4 py-3 text-ua-ink"
                  />
                </div>

                <button
                  type="button"
                  className="rounded-full bg-ua-orange px-7 py-3 font-bold text-ua-bg hover:opacity-90"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  Send →
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCta />
    </>
  );
}

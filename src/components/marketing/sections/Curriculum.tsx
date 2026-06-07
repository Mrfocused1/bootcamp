import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";

type Day = {
  day: string;
  color: string;
  sticker: string;
  bullets: string[];
};

const DAYS: Day[] = [
  {
    day: "Day 1 — Build the look",
    color: "bg-ua-green",
    sticker: "cursor-star",
    bullets: [
      "Clone any website from a link",
      "Recreate a design from a screenshot",
      "Generate images with ChatGPT",
      "AI icons, logos & graphics",
      "Voice-control coding with Whisper",
      "Set up & build in Cursor",
      "Ship your first live page",
    ],
  },
  {
    day: "Day 2 — Make it real",
    color: "bg-ua-blue text-ua-bg",
    sticker: "lightning",
    bullets: [
      "Databases with Supabase",
      "Store & fetch your data",
      "User sign-up & login",
      "Connect your front-end",
      "Version control with GitHub",
      "Save & roll back changes",
      "Work safely with AI",
    ],
  },
  {
    day: "Day 3 — Get paid",
    color: "bg-ua-orange",
    sticker: "hundred",
    bullets: [
      "Take payments with Stripe",
      "Send emails with Resend",
      "Set up a CRM",
      "Capture & manage leads",
    ],
  },
  {
    day: "Day 4 — Launch it live",
    color: "bg-ua-pink",
    sticker: "earth",
    bullets: [
      "Hosting your site",
      "Connect a custom domain",
      "Go live to the world",
      "Debug like a pro",
    ],
  },
  {
    day: "Day 5 — Get found & grow",
    color: "bg-ua-sky",
    sticker: "megaphone",
    bullets: [
      "SEO fundamentals",
      "Rank on Google",
      "Analytics & iteration",
      "Recap + live Q&A",
    ],
  },
];

export function Curriculum() {
  return (
    <section className="bg-ua-bg px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2
            className="text-center text-4xl font-bold text-ua-ink md:text-6xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            what you&apos;ll learn
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-lg text-ua-ink/70">
            five 1-hour live sessions, from idea to launch.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {DAYS.map((d, i) => {
            const dark = d.color.includes("text-ua-bg");
            const rotation = i % 2 === 0 ? "rotate-[-1.5deg]" : "rotate-[1.5deg]";
            return (
              <Reveal key={d.day} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-3xl border-2 border-ua-ink ${d.color} ${rotation} p-7 transition-transform hover:rotate-0`}
                >
                  <Sticker
                    name={d.sticker}
                    size={64}
                    className="absolute -right-3 -top-7"
                    rotate={8}
                  />
                  <h3
                    className="pr-8 text-2xl font-bold"
                    style={{ fontFamily: "var(--font-epilogue)" }}
                  >
                    {d.day}
                  </h3>
                  <ul className="mt-5 space-y-3">
                    {d.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-base leading-snug">
                        <span
                          aria-hidden
                          className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
                            dark ? "bg-ua-bg" : "bg-ua-ink"
                          }`}
                        />
                        <span className={dark ? "text-ua-bg" : "text-ua-ink/90"}>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

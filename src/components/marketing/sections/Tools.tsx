import { Reveal } from "@/components/marketing/Reveal";

// Full-colour brand marks (svgl / SimpleIcons brand colours). Logos only — no
// wordmark text. Wispr is omitted until a logo asset exists for it.
const TOOLS: { name: string; icon: string }[] = [
  { name: "Cursor", icon: "/marketing/tools/color/cursor.svg" },
  { name: "Supabase", icon: "/marketing/tools/color/supabase.svg" },
  { name: "Stripe", icon: "/marketing/tools/color/stripe.svg" },
  { name: "Resend", icon: "/marketing/tools/color/resend.svg" },
  { name: "Google", icon: "/marketing/tools/color/google.svg" },
  { name: "GitHub", icon: "/marketing/tools/color/github.svg" },
];

const EDGE_FADE =
  "linear-gradient(to right, transparent, black 12%, black 88%, transparent)";

export function Tools() {
  return (
    <section className="overflow-hidden bg-ua-bg pb-24 pt-2 md:pb-32">
      <Reveal>
        <h2
          className="px-6 text-center text-4xl font-black tracking-tight text-ua-ink md:text-6xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          Tools that will be used
        </h2>
      </Reveal>

      {/* Auto-scrolling logo band; the mask fades both edges to transparent. */}
      <div
        className="mt-12 w-full overflow-hidden md:mt-16"
        style={{ maskImage: EDGE_FADE, WebkitMaskImage: EDGE_FADE }}
      >
        <div className="ua-marquee flex w-max items-center">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              aria-hidden={dup === 1 ? "true" : undefined}
              className="flex items-center"
            >
              {TOOLS.map((t) => (
                <div
                  key={`${dup}-${t.name}`}
                  className="mx-10 flex shrink-0 items-center md:mx-14"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.icon}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="h-10 w-auto md:h-12"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

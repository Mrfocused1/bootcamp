import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";

// Official brand logos in their real colours — wordmark lockups where that IS
// the brand's logo (Stripe, Google, GitHub, Cursor), icon marks otherwise
// (Supabase bolt, Resend R). No hand-typed text. Wispr is omitted until a
// logo asset exists for it.
const TOOLS: { name: string; icon: string; imgClass: string }[] = [
  { name: "Cursor", icon: "/marketing/tools/color/cursor.svg", imgClass: "h-7 md:h-8" },
  { name: "Supabase", icon: "/marketing/tools/color/supabase.svg", imgClass: "h-10 md:h-11" },
  { name: "Stripe", icon: "/marketing/tools/color/stripe.svg", imgClass: "h-8 md:h-10" },
  { name: "Resend", icon: "/marketing/tools/color/resend.svg", imgClass: "h-9 md:h-10" },
  { name: "Google", icon: "/marketing/tools/color/google.svg", imgClass: "h-9 md:h-10" },
  { name: "GitHub", icon: "/marketing/tools/color/github.svg", imgClass: "h-8 md:h-9" },
];

const EDGE_FADE =
  "linear-gradient(to right, transparent, black 12%, black 88%, transparent)";

export function Tools() {
  return (
    <section className="overflow-hidden bg-ua-bg pb-24 pt-2 md:pb-32">
      <Reveal>
        <div className="px-6 text-center">
          <h2
            className="relative inline-block text-4xl font-black tracking-tight text-ua-ink md:text-6xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Tools that will be used
            <Sticker
              name="laptop-2"
              size={104}
              rotate={-9}
              className="pointer-events-none absolute -left-28 top-0 z-10 hidden sm:block md:-left-44 md:-top-2"
            />
          </h2>
        </div>
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
                    className={`w-auto ${t.imgClass}`}
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

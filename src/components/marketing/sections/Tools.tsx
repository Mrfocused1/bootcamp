import { Reveal } from "@/components/marketing/Reveal";

// Monochrome brand marks (SimpleIcons, recoloured to ink). Wispr has no icon
// in the set, so it rides as a wordmark only.
const TOOLS: { name: string; icon: string | null }[] = [
  { name: "Cursor", icon: "/marketing/tools/cursor.svg" },
  { name: "Supabase", icon: "/marketing/tools/supabase.svg" },
  { name: "Stripe", icon: "/marketing/tools/stripe.svg" },
  { name: "Resend", icon: "/marketing/tools/resend.svg" },
  { name: "Google", icon: "/marketing/tools/google.svg" },
  { name: "GitHub", icon: "/marketing/tools/github.svg" },
  { name: "Wispr", icon: null },
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
                  className="mx-8 flex shrink-0 items-center gap-3 md:mx-12"
                >
                  {t.icon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.icon}
                      alt=""
                      aria-hidden="true"
                      width={32}
                      height={32}
                      className="h-7 w-7 md:h-8 md:w-8"
                    />
                  )}
                  <span
                    className="text-2xl font-black text-ua-ink md:text-3xl"
                    style={{ fontFamily: "var(--font-epilogue)" }}
                  >
                    {t.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

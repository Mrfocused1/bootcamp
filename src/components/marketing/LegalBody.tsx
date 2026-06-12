import { Reveal } from "@/components/marketing/Reveal";

export type LegalSection = { heading: string; paras: string[] };

/**
 * Shared long-form content body for legal pages (Privacy, Terms). Renders a
 * "last updated" line, an intro, and a list of headed sections — styled to match
 * the rest of the marketing site.
 */
export function LegalBody({
  lastUpdated,
  intro,
  sections,
}: {
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="bg-ua-bg px-6 py-24 md:px-10">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ua-ink/50">
            Last updated: {lastUpdated}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ua-ink/80">{intro}</p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10">
          {sections.map((s, i) => (
            <Reveal key={s.heading} y={20 + i * 2}>
              <div>
                <h2
                  className="text-2xl font-black lowercase tracking-tight text-ua-ink md:text-3xl"
                  style={{ fontFamily: "var(--font-epilogue)" }}
                >
                  {s.heading}
                </h2>
                <div className="mt-3 flex flex-col gap-3">
                  {s.paras.map((p, j) => (
                    <p key={j} className="leading-relaxed text-ua-ink/80">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

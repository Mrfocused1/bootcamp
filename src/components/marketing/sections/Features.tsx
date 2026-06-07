import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { FEATURES } from "@/lib/marketing/content";

export function Features() {
  return (
    <section className="bg-ua-bg px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2
            className="max-w-3xl text-4xl font-bold text-ua-ink md:text-6xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            everything you need to ship a real website
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {FEATURES.map((f) => (
            <Reveal key={f.title}>
              <div className="relative rounded-3xl border-2 border-ua-ink bg-white/50 p-8">
                <Sticker name={f.sticker} size={72} className="absolute -right-3 -top-7" rotate={8} />
                <h3 className="text-2xl font-bold text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
                  {f.title}
                </h3>
                <p className="mt-3 text-lg text-ua-ink/80">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

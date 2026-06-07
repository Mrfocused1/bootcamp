import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { STATS } from "@/lib/marketing/content";

export function JoinClub() {
  return (
    <section className="relative overflow-hidden bg-ua-blue px-6 py-24 text-ua-bg md:px-10">
      <Sticker name="join-the-club" size={120} className="absolute right-6 top-10 hidden md:block" rotate={-8} />
      <Sticker name="hundred" size={88} className="absolute bottom-10 left-8 hidden md:block" rotate={6} />
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-6xl" style={{ fontFamily: "var(--font-epilogue)" }}>
            join the club
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <p className="text-5xl font-bold md:text-7xl" style={{ fontFamily: "var(--font-epilogue)" }}>{s.value}</p>
              <p className="mt-2 text-lg text-ua-bg/80">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

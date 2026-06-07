import Link from "next/link";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { SYLLABUS_DAYS } from "@/lib/marketing/content";

export function Syllabus() {
  return (
    <section className="bg-ua-ink px-6 py-24 text-ua-bg md:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <h2 className="text-4xl font-bold md:text-6xl" style={{ fontFamily: "var(--font-epilogue)" }}>
            5 days, start to launch
          </h2>
        </Reveal>
        <div className="mt-12 space-y-4">
          {SYLLABUS_DAYS.map((d) => (
            <Reveal key={d.day}>
              <div className="flex items-center gap-5 rounded-2xl border border-ua-bg/20 p-6">
                <Sticker name={d.sticker} size={56} />
                <div>
                  <p className="text-sm uppercase tracking-widest text-ua-pink">{d.day}</p>
                  <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-epilogue)" }}>{d.title}</h3>
                  <p className="text-ua-bg/70">{d.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Link href="/syllabus" className="mt-10 inline-block text-lg font-bold text-ua-pink hover:underline">
            see the full syllabus →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { Sticker } from "@/components/marketing/Sticker";

const TOTAL_STEPS = 3;

// Blue hand-drawn underline used under the step headings.
const UNDERLINE = "M4 18C70 7 150 6 230 11C285 14 268 22 232 23C300 16 380 13 452 18";

export function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  const dark = step === 2;

  // Gentle fade/slide between steps.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
      );
      // High-impact staggered pop for cards/rows (y + scale only, so it doesn't
      // fight the block opacity fade above).
      const items = el.querySelectorAll("[data-stagger]");
      if (items.length) {
        gsap.from(items, {
          y: 22,
          scale: 0.95,
          stagger: 0.06,
          duration: 0.5,
          ease: "back.out(1.5)",
          delay: 0.12,
        });
      }
    }, el);
    return () => ctx.revert();
  }, [step]);

  function goNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    if (step === 1) {
      router.back();
      return;
    }
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleFinish() {
    try {
      localStorage.setItem("ua_onboarded", "1");
    } catch {
      // localStorage may be unavailable in some environments; proceed anyway
    }
    router.push("/dashboard");
  }

  return (
    <div
      className={`relative flex min-h-svh flex-col overflow-hidden px-5 py-5 transition-colors duration-500 sm:px-8 sm:py-7 ${
        dark ? "bg-ua-ink text-ua-bg" : "bg-ua-bg text-ua-ink"
      }`}
    >
      {/* Atmospheric depth — soft colour washes so the surface isn't flat */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {dark ? (
          <>
            <div className="absolute -left-1/4 -top-1/4 h-[60%] w-[60%] rounded-full bg-ua-blue/15 blur-3xl" />
            <div className="absolute -bottom-1/4 -right-1/4 h-[60%] w-[60%] rounded-full bg-ua-green/12 blur-3xl" />
          </>
        ) : (
          <>
            <div className="absolute -right-1/4 -top-1/3 h-[70%] w-[70%] rounded-full bg-ua-pink/30 blur-3xl" />
            <div className="absolute -bottom-1/4 -left-1/4 h-[55%] w-[55%] rounded-full bg-ua-sky/25 blur-3xl" />
          </>
        )}
      </div>

      {/* ── Top bar: logo + stepper ── */}
      <header className="flex items-center justify-between">
        <Link href="/" aria-label="Bridgeway AI Bootcamp">
          <BrandLogo
            color={dark ? "var(--ua-bg)" : "var(--ua-ink)"}
            className="h-9 w-[42px] md:h-10 md:w-[46px]"
          />
        </Link>
        <Stepper step={step} dark={dark} />
      </header>

      {/* ── Step content ── */}
      <main ref={contentRef} className="mx-auto flex w-full max-w-6xl flex-1 items-center py-4 sm:py-8">
        {step === 1 && <StepWelcome />}
        {step === 2 && <StepSchedule onSkip={goNext} />}
        {step === 3 && <StepExpect />}
      </main>

      {/* ── Bottom bar: back + next ── */}
      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <button
          onClick={goBack}
          className={`inline-flex items-center gap-2 rounded-full border-2 px-5 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 ${
            dark
              ? "border-ua-bg/40 text-ua-bg hover:border-ua-bg"
              : "border-ua-ink text-ua-ink"
          }`}
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          &larr; Back
        </button>

        {step < TOTAL_STEPS ? (
          <button
            onClick={goNext}
            className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold shadow-[4px_4px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5 ${
              dark ? "bg-ua-bg text-ua-ink" : "bg-ua-ink text-ua-bg"
            }`}
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Next &rarr;
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="inline-flex items-center gap-2 rounded-full bg-ua-ink px-8 py-3 text-sm font-bold text-ua-bg shadow-[4px_4px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            Go to my dashboard &rarr;
          </button>
        )}
      </footer>
    </div>
  );
}

/* ── Stepper ── */
function Stepper({ step, dark }: { step: number; dark: boolean }) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const idx = i + 1;
        const done = idx < step;
        const active = idx === step;
        return (
          <div key={idx} className="flex items-center gap-1.5 sm:gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold ${
                done
                  ? "border-ua-ink bg-ua-green text-ua-ink"
                  : active
                    ? dark
                      ? "border-ua-bg bg-ua-bg text-ua-ink"
                      : "border-ua-ink bg-ua-ink text-ua-bg"
                    : dark
                      ? "border-ua-bg/40 text-ua-bg/60"
                      : "border-ua-ink/30 text-ua-ink/40"
              }`}
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              {done ? "✓" : idx}
            </span>
            {idx < TOTAL_STEPS && (
              <span
                className={`h-0.5 w-5 rounded-full sm:w-8 ${
                  done ? "bg-ua-green" : dark ? "bg-ua-bg/25" : "bg-ua-ink/15"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Heading underline ── */
function Underline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 456 28"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={`pointer-events-none text-ua-blue ${className}`}
    >
      <path d={UNDERLINE} stroke="currentColor" strokeWidth={5} strokeLinecap="round" />
    </svg>
  );
}

/* ═══════════════ STEP 1: Welcome ═══════════════ */

const FLOW = [
  { n: 1, label: "IDEA", bg: "var(--ua-blue)", fg: "text-ua-bg", icon: "sparkles" },
  { n: 2, label: "DESIGN", bg: "var(--ua-green)", fg: "text-ua-ink", icon: "cursor-star" },
  { n: 3, label: "BUILD", bg: "var(--ua-orange)", fg: "text-ua-ink", icon: "lightning" },
  { n: 4, label: "LAUNCH", bg: "#f6c945", fg: "text-ua-ink", icon: "earth" },
  { n: 5, label: "GROWTH", bg: "#c79cf2", fg: "text-ua-ink", icon: "megaphone" },
];

function StepWelcome() {
  return (
    <div className="grid w-full grid-cols-2 grid-rows-[auto_1fr] items-start gap-x-4 gap-y-3 self-stretch lg:items-center lg:gap-x-16 lg:self-center">
      {/* Heading — full width on mobile, top of the left column on desktop */}
      <div className="col-span-2 lg:col-span-1 lg:col-start-1 lg:row-start-1 lg:self-end">
        <h1
          className="relative inline-block text-3xl font-black leading-[1.05] tracking-tight text-ua-ink sm:text-5xl md:text-6xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          Welcome to Bridgeway AI Bootcamp
          <Underline className="absolute -bottom-2 left-0 h-3 w-3/5 sm:-bottom-3 sm:h-4" />
        </h1>
      </div>

      {/* Body copy — bottom-left on mobile, under the heading on desktop. On
          mobile it stretches and spaces its paragraphs down the column so it
          doesn't bunch up at the top alongside the flow. */}
      <div className="col-start-1 row-start-2 flex h-full flex-col justify-evenly gap-5 self-stretch lg:block lg:h-auto lg:self-start">
        <p className="max-w-md text-sm leading-relaxed text-ua-ink/70 sm:text-lg">
          Over the next 5 days you&rsquo;ll go from idea to a fully deployed,
          AI-powered product — with live coaching, hands-on sessions, and a real
          website you can show the world.
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ua-ink/70 sm:mt-4 sm:text-lg">
          Each day builds on the last:{" "}
          <span className="font-bold text-ua-ink">
            design → database → payments → launch → growth.
          </span>{" "}
          You&rsquo;ll finish with skills you can use for every project after this.
        </p>
      </div>

      {/* Idea → growth flow — bottom-right on mobile, right column on desktop */}
      <div className="relative col-start-2 row-start-2 mx-auto w-full max-w-[12rem] self-stretch lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:max-w-sm lg:self-center">
        <div className="relative flex h-full flex-col justify-between lg:h-auto lg:justify-start lg:gap-5">
          {/* Continuous dashed "journey" line that threads the badges together,
              so the spread-out cards read as one connected flow. */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-7 left-5 top-7 border-l-2 border-dashed border-ua-ink/35 sm:left-[30px]"
          />
          {FLOW.map((f) => (
            <div
              key={f.label}
              data-stagger
              className="relative z-10 flex items-center gap-2 rounded-xl border-2 border-ua-ink px-2.5 py-2.5 shadow-[3px_3px_0_var(--ua-ink)] sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3.5 sm:shadow-[5px_5px_0_var(--ua-ink)]"
              style={{ backgroundColor: f.bg }}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ua-ink text-[11px] font-bold text-ua-bg sm:h-7 sm:w-7 sm:text-sm">
                {f.n}
              </span>
              <span
                className={`flex-1 text-sm font-black uppercase tracking-wide sm:text-xl ${f.fg}`}
                style={{ fontFamily: "var(--font-epilogue)" }}
              >
                {f.label}
              </span>
              <Sticker name={f.icon} size={24} rotate={-4} className="sm:hidden" />
              <Sticker name={f.icon} size={34} rotate={-4} className="hidden sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════ STEP 2: Schedule ═══════════════ */

const SCHEDULE = [
  { n: 1, day: "Day 1", date: "Mon, Jun 17", time: "6:00 PM", color: "var(--ua-blue)", timeColor: "text-ua-blue" },
  { n: 2, day: "Day 2", date: "Tue, Jun 18", time: "6:00 PM", color: "#3a9a4e", timeColor: "text-[#3a9a4e]" },
  { n: 3, day: "Day 3", date: "Wed, Jun 19", time: "6:00 PM", color: "var(--ua-orange)", timeColor: "text-ua-orange" },
  { n: 4, day: "Day 4", date: "Thu, Jun 20", time: "6:00 PM", color: "#d99e00", timeColor: "text-[#c79400]" },
  { n: 5, day: "Day 5", date: "Fri, Jun 21", time: "6:00 PM", color: "#8b5cf6", timeColor: "text-[#8b5cf6]" },
];

function StepSchedule({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Left: copy + actions */}
      <div>
        <Sticker name="phone-hand" size={56} rotate={-6} className="mb-4" />
        <h1
          className="relative inline-block text-4xl font-black leading-[1.02] tracking-tight text-ua-bg sm:text-5xl md:text-6xl"
          style={{ fontFamily: "var(--font-epilogue)" }}
        >
          Set your schedule
          <Underline className="absolute -bottom-3 left-0 h-4 w-2/3" />
        </h1>
        <p className="mt-9 max-w-md text-lg leading-relaxed text-ua-bg/80">
          Pick the start day and daily time that works best for you.
        </p>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-ua-bg/80">
          We&rsquo;ll schedule all 5 of your live 1-hour sessions around it — so
          you always know what&rsquo;s coming next.
        </p>

        <Link
          href="/book"
          className="group mt-8 flex max-w-md items-center gap-4 rounded-2xl border-2 border-ua-bg/25 bg-ua-bg/5 p-4 transition-colors hover:bg-ua-bg/10"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ua-bg"><Sticker name="phone-hand" size={28} /></span>
          <span className="flex-1">
            <span className="block font-bold text-ua-bg" style={{ fontFamily: "var(--font-epilogue)" }}>
              Choose my schedule
            </span>
            <span className="block text-sm text-ua-bg/60">Pick your preferred day and time</span>
          </span>
          <span className="text-xl text-ua-bg/70 transition-transform group-hover:translate-x-1">→</span>
        </Link>

        <button
          onClick={onSkip}
          className="mt-5 text-sm font-bold text-ua-bg underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          Skip for now
        </button>
      </div>

      {/* Right: example schedule card */}
      <div className="relative mx-auto hidden w-full max-w-sm lg:block">
        <Sticker name="starburst" size={48} rotate={-8} className="pointer-events-none absolute -left-12 -top-8" />
        <Sticker name="sparkles" size={44} rotate={10} className="pointer-events-none absolute -left-8 bottom-8" />
        {/* organic blob behind */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-6 -left-6 h-28 w-28 bg-ua-blue/70"
          style={{ borderRadius: "60% 40% 55% 45% / 55% 50% 50% 45%" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 top-6 h-24 w-24 bg-ua-green/60"
          style={{ borderRadius: "55% 45% 60% 40% / 50% 55% 45% 50%" }}
        />
        <div className="relative -rotate-2 rounded-3xl border-2 border-ua-ink bg-white p-5 text-ua-ink shadow-[8px_8px_0_var(--ua-ink)]">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-ua-green px-3 py-1 text-xs font-bold text-ua-ink">
            Your schedule (example)
          </div>
          <ul className="flex flex-col">
            {SCHEDULE.map((s, i) => (
              <li
                key={s.day}
                data-stagger
                className={`flex items-center gap-3 py-3 ${i < SCHEDULE.length - 1 ? "border-b border-ua-ink/10" : ""}`}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-ua-bg"
                  style={{ backgroundColor: s.color }}
                >
                  {s.n}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
                    {s.day}
                  </span>
                  <span className="block text-xs text-ua-ink/55">{s.date}</span>
                </span>
                <span className={`text-sm font-bold ${s.timeColor}`}>{s.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ STEP 3: What to expect ═══════════════ */

const FEATURES = [
  { icon: "high-five", bg: "var(--ua-pink)", title: "5 daily 1-hour live sessions with your coach", desc: "Interactive, hands-on sessions to help you build and launch your AI-powered product." },
  { icon: "camera", bg: "var(--ua-green)", title: "Full session recordings to rewatch at any time", desc: "Missed a session? Rewatch at your own pace and never fall behind." },
  { icon: "cursor-star", bg: "var(--ua-sky)", title: "AI assistant ready to answer questions mid-lesson", desc: "Get instant help and clarity so you can keep building with confidence." },
  { icon: "hundred", bg: "#fbe49a", title: "Mark lessons complete to track your progress", desc: "Stay motivated and see your progress as you build each day." },
  { icon: "earth", bg: "var(--ua-pink)", title: "A real, live website by the end of Day 5", desc: "Launch something real that you can share with the world." },
];

function StepExpect() {
  return (
    <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Left: heading + features */}
      <div>
        <div>
          <Sticker name="lets-go" size={56} rotate={-8} className="pointer-events-none mb-1 block" />
          <h1
            className="relative inline-block text-4xl font-black leading-[1.02] tracking-tight text-ua-ink sm:text-5xl md:text-6xl"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            What to expect
            <Underline className="absolute -bottom-3 left-0 h-4 w-3/4" />
          </h1>
        </div>

        <div className="mt-9 flex flex-col gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              data-stagger
              className="flex items-start gap-3 rounded-2xl border-2 border-ua-ink bg-white p-3.5 shadow-[4px_4px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ua-ink)]"
            >
              <span
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl"
                style={{ backgroundColor: f.bg }}
              >
                <Sticker name={f.icon} size={26} />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ua-green text-[10px] font-bold text-ua-ink">
                    ✓
                  </span>
                  <p className="font-bold leading-tight text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
                    {f.title}
                  </p>
                </div>
                <p className="mt-1 pl-7 text-sm text-ua-ink/65">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: dashboard preview collage */}
      <div className="relative mx-auto hidden h-[34rem] w-full max-w-md lg:block">
        {/* blobs */}
        <div aria-hidden className="pointer-events-none absolute right-10 top-2 h-28 w-28 bg-ua-pink/50" style={{ borderRadius: "60% 40% 50% 50% / 55% 50% 50% 45%" }} />
        <div aria-hidden className="pointer-events-none absolute bottom-12 left-6 h-32 w-32 bg-ua-blue/30" style={{ borderRadius: "50% 50% 55% 45% / 50% 55% 45% 50%" }} />

        {/* Live session card */}
        <div className="absolute left-0 top-0 w-56 rotate-[-3deg] overflow-hidden rounded-2xl border-2 border-ua-ink bg-white shadow-[6px_6px_0_var(--ua-ink)]">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marketing/bridgeway-hero.png" alt="" aria-hidden className="h-32 w-full object-cover" />
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-ua-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-ua-blue" /> LIVE SESSION
            </span>
          </div>
        </div>

        {/* AI assistant chat card */}
        <div className="absolute right-0 top-8 w-52 rotate-[3deg] rounded-2xl border-2 border-ua-ink bg-ua-green/40 p-3 shadow-[6px_6px_0_var(--ua-ink)]">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-ua-ink">AI ASSISTANT</div>
          <p className="rounded-xl rounded-tl-sm bg-white px-3 py-1.5 text-xs text-ua-ink">How can I help you today?</p>
          <p className="mt-2 ml-6 rounded-xl rounded-tr-sm bg-ua-ink px-3 py-1.5 text-xs text-ua-bg">How do I connect payments?</p>
        </div>

        {/* Progress card */}
        <div className="absolute left-2 top-44 w-72 rounded-2xl border-2 border-ua-ink bg-white p-4 shadow-[6px_6px_0_var(--ua-ink)]">
          <p className="text-sm font-bold text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>Your Progress</p>
          <div className="mt-2 flex items-center justify-between text-xs text-ua-ink/60">
            <span>Day 3 of 5</span>
            <span className="font-bold text-ua-ink">60%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ua-ink/10">
            <div className="h-full rounded-full bg-ua-green" style={{ width: "60%" }} />
          </div>
          <div className="mt-3 flex justify-between">
            {[1, 2, 3, 4, 5].map((d) => (
              <div key={d} className="flex flex-col items-center gap-1">
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full border-2 border-ua-ink text-xs font-bold ${
                    d < 3 ? "bg-ua-green text-ua-ink" : d === 3 ? "bg-ua-ink text-ua-bg" : "bg-white text-ua-ink/40"
                  }`}
                >
                  {d < 3 ? "✓" : d}
                </span>
                <span className="text-[9px] text-ua-ink/50">Day {d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini website mockup */}
        <div className="absolute bottom-0 right-2 w-60 rotate-[2deg] overflow-hidden rounded-2xl border-2 border-ua-ink bg-white shadow-[6px_6px_0_var(--ua-ink)]">
          <div className="flex items-center justify-between border-b border-ua-ink/10 px-3 py-2">
            <span className="text-xs font-bold text-ua-ink">My AI Product</span>
            <span className="rounded-full bg-ua-ink px-2 py-0.5 text-[9px] font-bold text-ua-bg">Get Started</span>
          </div>
          <div className="flex items-center gap-2 p-3">
            <div className="flex-1">
              <p className="text-sm font-black leading-tight text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>Smart tools for modern creators.</p>
              <span className="mt-2 inline-block rounded-full border border-ua-ink px-2 py-0.5 text-[9px] font-bold text-ua-ink">Try it now →</span>
            </div>
            <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-ua-blue to-ua-pink" />
          </div>
        </div>
      </div>
    </div>
  );
}

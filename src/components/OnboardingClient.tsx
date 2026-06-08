"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const TOTAL_STEPS = 3;

export function OnboardingClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  function goNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
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
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--ua-bg)" }}
    >
      <div
        className="w-full max-w-lg rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col gap-8"
        style={{ backgroundColor: "#fff" }}
      >
        {/* Wordmark */}
        <div className="text-center">
          <span
            className="font-genty text-4xl leading-none"
            style={{ color: "var(--ua-blue)" }}
          >
            Bridgeway AI
          </span>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const idx = i + 1;
            const isActive = idx === step;
            const isDone = idx < step;
            return (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors"
                  style={{
                    backgroundColor: isActive || isDone ? "var(--ua-blue)" : "transparent",
                    color: isActive || isDone ? "#fff" : "var(--ua-ink)",
                    border: isActive || isDone ? "none" : "2px solid rgba(20,20,20,0.2)",
                  }}
                >
                  {isDone ? "✓" : idx}
                </div>
                {idx < TOTAL_STEPS && (
                  <div
                    className="h-0.5 w-8 rounded-full"
                    style={{
                      backgroundColor: isDone ? "var(--ua-blue)" : "rgba(20,20,20,0.12)",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex flex-col gap-5 min-h-[14rem]">
          {step === 1 && <StepWelcome />}
          {step === 2 && <StepSchedule onSkip={goNext} />}
          {step === 3 && <StepExpect />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-30 hover:opacity-70"
            style={{ color: "var(--ua-ink)" }}
          >
            &larr; Back
          </button>

          {step < TOTAL_STEPS ? (
            <button
              onClick={goNext}
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Next &rarr;
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
            >
              Go to my dashboard &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Individual step components ── */

function StepWelcome() {
  return (
    <div className="flex flex-col gap-4">
      <h1
        className="text-2xl font-bold leading-snug"
        style={{
          fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
          color: "var(--ua-ink)",
        }}
      >
        Welcome to Bridgeway AI Bootcamp 👋
      </h1>
      <p className="text-base leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
        Over the next 5 days you&rsquo;ll go from idea to a fully deployed, AI-powered product —
        with live coaching, hands-on sessions, and a real website you can show the world.
      </p>
      <p className="text-base leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
        Each day builds on the last: design &rarr; database &rarr; payments &rarr; launch &rarr; growth.
        You&rsquo;ll finish with skills you can use for every project after this.
      </p>
    </div>
  );
}

interface StepScheduleProps {
  onSkip: () => void;
}

function StepSchedule({ onSkip }: StepScheduleProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2
        className="text-2xl font-bold leading-snug"
        style={{
          fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
          color: "var(--ua-ink)",
        }}
      >
        Set your schedule
      </h2>
      <p className="text-base leading-relaxed" style={{ color: "var(--ua-ink)", opacity: 0.7 }}>
        Pick the start day and daily time that works best for you. We&rsquo;ll schedule all
        5 of your live 1-hour sessions around it — so you always know what&rsquo;s coming next.
      </p>
      <div className="flex flex-col gap-3 pt-1">
        <Link
          href="/book"
          className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-85"
          style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
        >
          Choose my schedule
        </Link>
        <button
          onClick={onSkip}
          className="text-sm underline underline-offset-2 transition-opacity hover:opacity-70 text-center"
          style={{ color: "var(--ua-ink)", opacity: 0.55 }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

function StepExpect() {
  const bullets = [
    "5 daily 1-hour live sessions with your coach",
    "Full session recordings to rewatch at any time",
    "AI assistant ready to answer questions mid-lesson",
    "Mark lessons complete to track your progress",
    "A real, live website by the end of Day 5",
  ];

  return (
    <div className="flex flex-col gap-4">
      <h2
        className="text-2xl font-bold leading-snug"
        style={{
          fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
          color: "var(--ua-ink)",
        }}
      >
        What to expect
      </h2>
      <ul className="flex flex-col gap-3">
        {bullets.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
              aria-hidden="true"
            >
              ✓
            </span>
            <span className="text-base leading-snug" style={{ color: "var(--ua-ink)", opacity: 0.75 }}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

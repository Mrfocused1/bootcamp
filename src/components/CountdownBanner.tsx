"use client";

import { useEffect, useState } from "react";

interface CountdownBannerProps {
  startDate: string; // ISO date string e.g. "2026-07-14"
  seats: number;
  seatsLeft: number;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatStartDate(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function getCountdown(targetISO: string) {
  const target = new Date(targetISO + "T00:00:00Z").getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, started: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, mins, secs, started: false };
}

export function CountdownBanner({ startDate, seats, seatsLeft }: CountdownBannerProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const { days, hours, mins, secs, started } = getCountdown(startDate);

  return (
    <div
      className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style={{ backgroundColor: "var(--ua-ink)", color: "#fff" }}
    >
      {/* Left: cohort info */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ opacity: 0.55 }}>
          Next cohort
        </p>
        <p className="text-base font-bold">
          Starts {formatStartDate(startDate)}
        </p>
        <p className="text-sm" style={{ opacity: 0.65 }}>
          {seatsLeft} of {seats} seats left
        </p>
      </div>

      {/* Right: countdown */}
      {started ? (
        <p className="text-sm font-semibold" style={{ opacity: 0.7 }}>
          Cohort has started — join now
        </p>
      ) : (
        <div className="flex items-center gap-3">
          {[
            { label: "days", value: days },
            { label: "hrs", value: hours },
            { label: "min", value: mins },
            { label: "sec", value: secs },
          ].map(({ label, value }, i) => (
            <div key={label} className="flex items-center gap-3">
              {i > 0 && <span className="text-lg font-bold" style={{ opacity: 0.35 }}>:</span>}
              <div className="flex flex-col items-center">
                <span
                  className="text-2xl font-bold tabular-nums leading-none"
                  style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
                >
                  {pad(value)}
                </span>
                <span className="text-xs uppercase tracking-wider mt-0.5" style={{ opacity: 0.5 }}>
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

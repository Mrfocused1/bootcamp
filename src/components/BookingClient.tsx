"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/Calendar";
import { TimePicker } from "@/components/TimePicker";
import { addDaysISO } from "@/lib/calendar";

const TIME_SLOTS = ["09:00", "12:00", "17:00", "19:30"];
const SESSION_COUNT = 5;

/** Format an ISO date as e.g. "Mon, Jun 8" using UTC. */
function formatSessionDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

interface BookingClientProps {
  todayISO: string;
}

export function BookingClient({ todayISO }: BookingClientProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const canConfirm = selectedDate !== null && selectedTime !== null;

  const sessions = canConfirm
    ? Array.from({ length: SESSION_COUNT }, (_, i) => ({
        label: `Day ${i + 1}`,
        date: addDaysISO(selectedDate!, i),
      }))
    : [];

  function handleConfirm() {
    if (!canConfirm) return;
    // TODO: persist via /api/book + Supabase in real mode
    setConfirmed(true);
  }

  if (confirmed && selectedDate && selectedTime) {
    const bookedSessions = Array.from({ length: SESSION_COUNT }, (_, i) => ({
      label: `Day ${i + 1}`,
      date: addDaysISO(selectedDate, i),
    }));

    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
        <div
          className="rounded-2xl p-8 space-y-6"
          style={{ backgroundColor: "var(--ua-sky)" }}
        >
          <div className="space-y-1">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.55 }}
            >
              Booking confirmed
            </p>
            <h1
              className="text-2xl font-bold lowercase"
              style={{
                fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
                color: "var(--ua-ink)",
              }}
            >
              you're all set!
            </h1>
            <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.75 }}>
              Your sessions are booked. Join links will be added closer to the time.
            </p>
          </div>

          <ul className="space-y-2">
            {bookedSessions.map((s) => (
              <li
                key={s.label}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                <span
                  className="text-xs font-semibold uppercase tracking-wider w-12 shrink-0"
                  style={{ color: "var(--ua-ink)", opacity: 0.5 }}
                >
                  {s.label}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--ua-ink)" }}>
                  {formatSessionDate(s.date)} · {selectedTime}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
            style={{ backgroundColor: "var(--ua-blue)", color: "#fff" }}
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 space-y-8">
      {/* Heading */}
      <section className="space-y-1">
        <h1
          className="text-3xl font-bold tracking-tight lowercase"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          choose your schedule
        </h1>
        <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
          Pick the day you'll start and the time that suits you. Your 5 daily sessions are
          scheduled automatically.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Calendar + Time picker */}
        <div className="space-y-5">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Start date
            </p>
            <Calendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              todayISO={todayISO}
            />
          </div>

          <div
            className="rounded-2xl p-5 space-y-3"
            style={{ backgroundColor: "#fff" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Daily time
            </p>
            <TimePicker
              slots={TIME_SLOTS}
              selected={selectedTime}
              onSelect={setSelectedTime}
            />
          </div>
        </div>

        {/* Right: Preview + Confirm */}
        <div className="space-y-5">
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{ backgroundColor: "#fff" }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "var(--ua-ink)", opacity: 0.5 }}
            >
              Your 5 sessions
            </p>

            {!canConfirm ? (
              <p
                className="text-sm"
                style={{ color: "var(--ua-ink)", opacity: 0.4 }}
              >
                Select a start date and time above to preview your schedule.
              </p>
            ) : (
              <ul className="space-y-2">
                {sessions.map((s, i) => (
                  <li
                    key={s.label}
                    className="flex items-start gap-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: "var(--ua-bg)" }}
                  >
                    <span
                      className="text-xs font-semibold uppercase tracking-wider w-12 shrink-0 pt-0.5"
                      style={{ color: "var(--ua-ink)", opacity: 0.45 }}
                    >
                      {s.label}
                    </span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--ua-ink)" }}>
                        {formatSessionDate(s.date)} · {selectedTime}
                      </p>
                      {i === 0 && (
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "var(--ua-ink)", opacity: 0.4 }}
                        >
                          Join link added closer to the time
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="w-full rounded-full py-3 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: canConfirm ? "var(--ua-blue)" : "rgba(20,20,20,0.1)",
              color: canConfirm ? "#fff" : "rgba(20,20,20,0.3)",
              cursor: canConfirm ? "pointer" : "not-allowed",
            }}
          >
            Confirm my schedule
          </button>
        </div>
      </div>
    </div>
  );
}

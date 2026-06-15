"use client";

import { useState } from "react";
import { monthGrid, isPastISO, addDaysISO } from "@/lib/calendar";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarProps {
  selected: string | null;
  onSelect: (iso: string) => void;
  todayISO: string;
  /** How many consecutive days a selection spans (for the booking range). */
  rangeLength?: number;
}

/** Set of ISO dates covered by a `len`-day span starting at `startISO`. */
function spanFrom(startISO: string, len: number): Set<string> {
  const s = new Set<string>();
  for (let i = 0; i < len; i++) s.add(addDaysISO(startISO, i));
  return s;
}

export function Calendar({ selected, onSelect, todayISO, rangeLength = 1 }: CalendarProps) {
  const [year, setYear] = useState(() => parseInt(todayISO.slice(0, 4), 10));
  const [month, setMonth] = useState(() => parseInt(todayISO.slice(5, 7), 10)); // 1-12
  const [hovered, setHovered] = useState<string | null>(null);

  const grid = monthGrid(year, month);
  const committed = selected ? spanFrom(selected, rangeLength) : new Set<string>();
  const preview = hovered && hovered !== selected ? spanFrom(hovered, rangeLength) : new Set<string>();

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  const navBtn =
    "flex h-9 w-9 items-center justify-center rounded-full border-2 border-ua-ink bg-white text-lg font-black text-ua-ink shadow-[2px_2px_0_var(--ua-ink)] transition-all hover:-translate-y-0.5 hover:bg-ua-ink hover:text-ua-bg active:translate-y-0 active:shadow-none";

  return (
    <div className="select-none rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
      {/* Month header */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={prevMonth} aria-label="Previous month" className={navBtn}>‹</button>
        <span
          className="text-lg font-black lowercase tracking-tight text-ua-ink"
          style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
        >
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <button onClick={nextMonth} aria-label="Next month" className={navBtn}>›</button>
      </div>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-1 text-center text-[11px] font-bold uppercase tracking-wide text-ua-ink/40"
            style={{ fontFamily: "var(--font-epilogue), Epilogue, sans-serif" }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1" onMouseLeave={() => setHovered(null)}>
        {grid.flat().map((iso, idx) => {
          if (!iso) return <div key={`empty-${idx}`} />;

          const isPast = isPastISO(iso, todayISO);
          const isSelected = iso === selected;
          const isToday = iso === todayISO;
          const inCommitted = committed.has(iso) && !isSelected;
          const inPreview = preview.has(iso) && !isSelected && !inCommitted;

          let stateCls: string;
          if (isPast) {
            stateCls = "text-ua-ink/25 cursor-not-allowed";
          } else if (isSelected) {
            stateCls = "bg-ua-blue text-white shadow-[2px_2px_0_var(--ua-ink)] -translate-y-0.5";
          } else if (inCommitted) {
            stateCls = "bg-ua-sky text-ua-ink";
          } else if (inPreview) {
            stateCls = "bg-ua-sky/30 text-ua-ink";
          } else {
            stateCls = "text-ua-ink hover:-translate-y-0.5 hover:bg-ua-ink/10";
          }

          return (
            <button
              key={iso}
              onClick={() => !isPast && onSelect(iso)}
              onMouseEnter={() => !isPast && setHovered(iso)}
              disabled={isPast}
              aria-label={iso}
              aria-pressed={isSelected}
              className={`flex aspect-square w-full items-center justify-center rounded-xl text-sm font-bold transition-all ${stateCls} ${
                isToday && !isSelected && !inCommitted ? "ring-2 ring-inset ring-ua-blue/60" : ""
              }`}
            >
              {parseInt(iso.slice(8), 10)}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      {rangeLength > 1 && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t-2 border-ua-ink/10 pt-3 text-[11px] font-semibold text-ua-ink/55">
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-md bg-ua-blue" /> Start day</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-md bg-ua-sky" /> Your {rangeLength} sessions</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-md ring-2 ring-inset ring-ua-blue/60" /> Today</span>
        </div>
      )}
    </div>
  );
}

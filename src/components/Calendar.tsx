"use client";

import { useState } from "react";
import { monthGrid, isPastISO } from "@/lib/calendar";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface CalendarProps {
  selected: string | null;
  onSelect: (iso: string) => void;
  todayISO: string;
}

export function Calendar({ selected, onSelect, todayISO }: CalendarProps) {
  const [year, setYear] = useState(() => parseInt(todayISO.slice(0, 4), 10));
  const [month, setMonth] = useState(() => parseInt(todayISO.slice(5, 7), 10)); // 1-12

  const grid = monthGrid(year, month);

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  return (
    <div
      className="rounded-2xl p-5 select-none"
      style={{ backgroundColor: "#fff" }}
    >
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--ua-blue)] hover:text-white text-[var(--ua-ink)]"
          style={{ fontFamily: "inherit" }}
        >
          ‹
        </button>
        <span
          className="font-semibold text-sm"
          style={{
            fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
            color: "var(--ua-ink)",
          }}
        >
          {MONTH_NAMES[month - 1]} {year}
        </span>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--ua-blue)] hover:text-white text-[var(--ua-ink)]"
          style={{ fontFamily: "inherit" }}
        >
          ›
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium py-1"
            style={{ color: "var(--ua-ink)", opacity: 0.4 }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-1">
        {grid.flat().map((iso, idx) => {
          if (!iso) {
            return <div key={`empty-${idx}`} />;
          }

          const isPast = isPastISO(iso, todayISO);
          const isSelected = iso === selected;
          const isToday = iso === todayISO;

          return (
            <button
              key={iso}
              onClick={() => !isPast && onSelect(iso)}
              disabled={isPast}
              aria-label={iso}
              aria-pressed={isSelected}
              className="w-full aspect-square flex items-center justify-center rounded-full text-sm transition-colors"
              style={{
                backgroundColor: isSelected ? "var(--ua-blue)" : "transparent",
                color: isSelected
                  ? "#fff"
                  : isPast
                  ? "var(--ua-ink)"
                  : "var(--ua-ink)",
                opacity: isPast ? 0.25 : 1,
                cursor: isPast ? "not-allowed" : "pointer",
                outline: isToday && !isSelected ? "2px solid var(--ua-blue)" : "none",
                outlineOffset: "1px",
                fontWeight: isToday ? 700 : 400,
              }}
            >
              {parseInt(iso.slice(8), 10)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

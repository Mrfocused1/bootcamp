"use client";

import { useEffect, useRef, useState } from "react";
import type { Chapter } from "@/lib/types";
import { formatTimestamp } from "@/lib/format";

interface ChapterMenuProps {
  chapters: Chapter[];
  onSelect: (seconds: number) => void;
}

export function ChapterMenu({ chapters, onSelect }: ChapterMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (chapters.length === 0) return null;

  function handleRowClick(startSeconds: number) {
    onSelect(startSeconds);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Trigger button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-sm font-medium transition-colors cursor-pointer"
        style={{
          backgroundColor: "#fff",
          borderColor: "rgba(20,20,20,0.18)",
          color: "var(--ua-ink)",
          width: "220px",
          justifyContent: "space-between",
        }}
      >
        {/* Left: list icon + label */}
        <span className="flex items-center gap-1.5 min-w-0">
          {/* simple list icon */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            style={{ flexShrink: 0, color: "var(--ua-blue)" }}
          >
            <rect x="0" y="1.5" width="5" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="7" y="1.5" width="7" height="1.5" rx="0.75" fill="currentColor" opacity="0.35" />
            <rect x="0" y="6.25" width="5" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="7" y="6.25" width="7" height="1.5" rx="0.75" fill="currentColor" opacity="0.35" />
            <rect x="0" y="11" width="5" height="1.5" rx="0.75" fill="currentColor" />
            <rect x="7" y="11" width="7" height="1.5" rx="0.75" fill="currentColor" opacity="0.35" />
          </svg>
          <span style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif" }}>
            Chapters
          </span>
        </span>

        {/* Right: chevron — rotates when open */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
          style={{
            flexShrink: 0,
            color: "var(--ua-ink)",
            opacity: 0.45,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          aria-label="Chapters"
          className="absolute left-0 z-50 mt-1.5 rounded-2xl border overflow-hidden"
          style={{
            width: "280px",
            backgroundColor: "#fff",
            borderColor: "rgba(20,20,20,0.12)",
            boxShadow:
              "0 8px 24px rgba(20,20,20,0.10), 0 2px 6px rgba(20,20,20,0.06)",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {/* Panel heading */}
          <div
            className="px-4 py-2.5 border-b text-xs font-semibold uppercase tracking-widest"
            style={{
              borderColor: "rgba(20,20,20,0.08)",
              color: "var(--ua-ink)",
              opacity: 0.45,
            }}
          >
            Jump to chapter
          </div>

          {/* Chapter rows */}
          {chapters.map((chapter, index) => (
            <button
              key={chapter.start_seconds}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => handleRowClick(chapter.start_seconds)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors"
              style={{ backgroundColor: "transparent" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--ua-bg)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--ua-bg)";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              {/* Index badge */}
              <span
                className="inline-flex items-center justify-center rounded-full text-xs font-bold shrink-0"
                style={{
                  width: "22px",
                  height: "22px",
                  backgroundColor: "var(--ua-blue)",
                  color: "#fff",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                {index + 1}
              </span>

              {/* Title */}
              <span
                className="flex-1 truncate text-sm font-medium"
                style={{
                  color: "var(--ua-ink)",
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                }}
              >
                {chapter.title}
              </span>

              {/* Timestamp pill */}
              <span
                className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: "var(--ua-bg)",
                  color: "var(--ua-ink)",
                  opacity: 0.7,
                  fontFamily: "var(--font-dm-sans), 'DM Sans', sans-serif",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {formatTimestamp(chapter.start_seconds)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

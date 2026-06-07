"use client";

import type { Chapter } from "@/lib/types";
import { formatTimestamp } from "@/lib/format";

interface ChapterMenuProps {
  chapters: Chapter[];
  onSelect: (seconds: number) => void;
}

export function ChapterMenu({ chapters, onSelect }: ChapterMenuProps) {
  if (chapters.length === 0) return null;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = Number(e.target.value);
    onSelect(value);
    // Reset to placeholder so the same chapter can be re-selected
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="chapter-menu"
        className="text-xs font-semibold uppercase tracking-widest"
        style={{ color: "var(--ua-ink)", opacity: 0.55 }}
      >
        Chapters
      </label>
      <select
        id="chapter-menu"
        defaultValue=""
        onChange={handleChange}
        className="rounded-full border px-3 py-1 text-sm font-medium cursor-pointer transition-colors"
        style={{
          borderColor: "rgba(20,20,20,0.2)",
          color: "var(--ua-ink)",
          backgroundColor: "var(--ua-bg)",
          appearance: "auto",
        }}
        aria-label="Jump to chapter"
      >
        <option value="" disabled hidden>
          Jump to…
        </option>
        {chapters.map((chapter) => (
          <option key={chapter.start_seconds} value={chapter.start_seconds}>
            {chapter.title} — {formatTimestamp(chapter.start_seconds)}
          </option>
        ))}
      </select>
    </div>
  );
}

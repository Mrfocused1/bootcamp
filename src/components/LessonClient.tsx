"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ChapterMenu } from "@/components/ChapterMenu";
import { AiAssistant } from "@/components/AiAssistant";
import type { Chapter } from "@/lib/types";

interface LessonClientProps {
  lessonId: string;
  videoProvider: string;
  videoId: string;
  startSeconds: number;
  chapters: Chapter[];
  /** Duration in seconds — used by "Mark complete" to force 100% */
  durationSeconds?: number;
  /** The next day index (1-based), or null if this is the last day */
  nextIndex: number | null;
  /** Whether the next day is currently unlocked */
  nextUnlocked: boolean;
}

const DEBOUNCE_MS = 10_000; // post progress at most once every 10 seconds

export function LessonClient({
  lessonId,
  videoProvider,
  videoId,
  startSeconds,
  chapters,
  durationSeconds,
  nextIndex,
  nextUnlocked,
}: LessonClientProps) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPostedRef = useRef<{ position: number; duration: number } | null>(null);
  const nonceRef = useRef(0);
  const [seek, setSeek] = useState<{ seconds: number; nonce: number } | null>(null);
  const [markState, setMarkState] = useState<"idle" | "loading" | "done">("idle");

  async function postProgress(positionSeconds: number, durationSeconds: number) {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, positionSeconds, durationSeconds }),
      });
      lastPostedRef.current = { position: positionSeconds, duration: durationSeconds };
    } catch {
      // Non-critical; swallow silently
    }
  }

  const handleProgress = useCallback(
    (positionSeconds: number, durationSeconds: number) => {
      // Debounce: clear any pending timer and set a new one
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        postProgress(positionSeconds, durationSeconds);
      }, DEBOUNCE_MS);
    },
    [lessonId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  function handleChapterSelect(seconds: number) {
    nonceRef.current += 1;
    setSeek({ seconds, nonce: nonceRef.current });
  }

  async function handleMarkComplete() {
    if (markState !== "idle") return;
    setMarkState("loading");
    try {
      if (durationSeconds && durationSeconds > 0) {
        // Position-based: force position = duration → 100%
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lessonId,
            positionSeconds: durationSeconds,
            durationSeconds,
          }),
        });
      } else {
        // Shortcut: send completed: true flag
        await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lessonId, completed: true }),
        });
      }
      setMarkState("done");
    } catch {
      // Non-critical; revert to idle so the user can retry
      setMarkState("idle");
    }
  }

  // Post immediately on pause (fired by the native video element's pause event via the player)
  // We expose a separate handler the Html5Player could call on pause, but to keep it simple
  // and avoid prop-drilling, we flush the debounce on the video's pause event by re-using
  // the same postProgress with the last known values captured in handleProgress.
  // A more complete solution would pass an onPause prop; left as a YAGNI trade-off for now.

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Video column */}
      <div className="flex-1 min-w-0 space-y-3">
        {chapters.length > 0 && (
          <ChapterMenu chapters={chapters} onSelect={handleChapterSelect} />
        )}
        <VideoPlayer
          provider={videoProvider}
          videoId={videoId}
          startSeconds={startSeconds}
          onProgress={handleProgress}
          seek={seek}
        />

        {/* ── Lesson footer: mark complete + next lesson ── */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl px-5 py-4"
          style={{ backgroundColor: "#fff" }}
        >
          {/* Mark complete button */}
          <button
            onClick={handleMarkComplete}
            disabled={markState !== "idle"}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors disabled:opacity-60"
            style={
              markState === "done"
                ? { backgroundColor: "var(--ua-green)", color: "var(--ua-ink)" }
                : { backgroundColor: "var(--ua-blue)", color: "#fff" }
            }
          >
            {markState === "done" ? "Completed ✓" : markState === "loading" ? "Saving…" : "Mark complete ✓"}
          </button>

          {/* Next lesson navigation */}
          {nextIndex !== null ? (
            nextUnlocked ? (
              <Link
                href={`/day/${nextIndex}`}
                className="inline-flex items-center gap-1.5 rounded-full border-2 px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ borderColor: "var(--ua-blue)", color: "var(--ua-blue)" }}
              >
                Next lesson &rarr;
              </Link>
            ) : (
              <p className="text-sm" style={{ color: "var(--ua-ink)", opacity: 0.45 }}>
                Next day unlocks soon
              </p>
            )
          ) : null}
        </div>
      </div>

      {/* AI assistant column */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <AiAssistant lessonId={lessonId} />
      </div>
    </div>
  );
}

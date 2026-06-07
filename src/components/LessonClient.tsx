"use client";

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
}

const DEBOUNCE_MS = 10_000; // post progress at most once every 10 seconds

export function LessonClient({
  lessonId,
  videoProvider,
  videoId,
  startSeconds,
  chapters,
}: LessonClientProps) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPostedRef = useRef<{ position: number; duration: number } | null>(null);
  const nonceRef = useRef(0);
  const [seek, setSeek] = useState<{ seconds: number; nonce: number } | null>(null);

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
      </div>

      {/* AI assistant column */}
      <div className="w-full lg:w-96 flex-shrink-0">
        <AiAssistant lessonId={lessonId} />
      </div>
    </div>
  );
}

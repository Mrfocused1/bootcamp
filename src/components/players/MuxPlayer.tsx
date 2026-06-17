"use client";

import { useEffect, useRef } from "react";
import MuxPlayerReact from "@mux/mux-player-react";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";

interface MuxPlayerProps {
  videoId: string; // Mux playback ID
  startSeconds: number;
  onProgress: (positionSeconds: number, durationSeconds: number) => void;
  /** When seek.nonce changes, immediately seek to seek.seconds and play. */
  seek?: { seconds: number; nonce: number } | null;
}

export function MuxPlayer({ videoId, startSeconds, onProgress, seek }: MuxPlayerProps) {
  const ref = useRef<MuxPlayerRefAttributes>(null);

  // Keep onProgress current without re-running effects on every render. Synced
  // in an effect (not during render) to satisfy react-hooks/refs.
  const progressRef = useRef(onProgress);
  useEffect(() => {
    progressRef.current = onProgress;
  });

  // Chapter seek: jump and play when seek.nonce changes.
  useEffect(() => {
    if (!seek) return;
    const el = ref.current;
    if (el) {
      el.currentTime = seek.seconds;
      el.play?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seek?.nonce]);

  return (
    <MuxPlayerReact
      ref={ref}
      playbackId={videoId}
      startTime={startSeconds}
      onTimeUpdate={(e) => {
        const el = (e.currentTarget ?? e.target) as MuxPlayerRefAttributes | null;
        if (el && el.duration > 0) {
          progressRef.current(el.currentTime, el.duration);
        }
      }}
      className="w-full aspect-video rounded-xl overflow-hidden bg-black"
    />
  );
}

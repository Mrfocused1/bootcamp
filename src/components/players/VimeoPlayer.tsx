"use client";

import { useEffect, useRef } from "react";
import Player from "@vimeo/player";

interface VimeoPlayerProps {
  videoId: string;
  startSeconds: number;
  onProgress: (positionSeconds: number, durationSeconds: number) => void;
  /** When seek.nonce changes, immediately seek to seek.seconds and play. */
  seek?: { seconds: number; nonce: number } | null;
}

export function VimeoPlayer({ videoId, startSeconds, onProgress, seek }: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  // Keep onProgress current without re-running the init effect. Synced in an
  // effect (not during render) to satisfy react-hooks/refs.
  const progressRef = useRef(onProgress);
  useEffect(() => {
    progressRef.current = onProgress;
  });

  // Create the player when the videoId changes (and on mount).
  useEffect(() => {
    if (!containerRef.current) return;

    const player = new Player(containerRef.current, {
      id: Number(videoId),
      responsive: true,
    });
    playerRef.current = player;

    player.ready().then(() => {
      if (startSeconds > 0) {
        player.setCurrentTime(startSeconds).catch(() => {
          // Seeking before metadata is ready can reject — ignore silently.
        });
      }
    });

    const handleTimeUpdate = (data: { seconds: number; duration: number }) => {
      if (data.duration > 0) {
        progressRef.current(data.seconds, data.duration);
      }
    };
    player.on("timeupdate", handleTimeUpdate);

    return () => {
      player.off("timeupdate");
      playerRef.current = null;
      player.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Chapter seek: jump and play when seek.nonce changes.
  useEffect(() => {
    if (!seek) return;
    const player = playerRef.current;
    if (!player) return;
    player
      .setCurrentTime(seek.seconds)
      .then(() => player.play())
      .catch(() => {
        // Autoplay may be blocked by the browser — ignore silently.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seek?.nonce]);

  return <div ref={containerRef} className="w-full aspect-video rounded-xl overflow-hidden bg-black" />;
}

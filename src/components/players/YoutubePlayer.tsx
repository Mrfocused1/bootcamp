"use client";

import { useEffect, useRef } from "react";

interface YoutubePlayerProps {
  videoId: string;
  startSeconds: number;
  onProgress: (positionSeconds: number, durationSeconds: number) => void;
  /** When seek.nonce changes, immediately seek to seek.seconds and play. */
  seek?: { seconds: number; nonce: number } | null;
}

const API_SRC = "https://www.youtube.com/iframe_api";
const SCRIPT_ID = "youtube-iframe-api";

/** Load the IFrame API once and resolve when window.YT is ready. */
function loadYouTubeApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    // Chain any existing handler so multiple players cooperate.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };

    // Inject the script only once (guarded by id).
    if (!document.getElementById(SCRIPT_ID)) {
      const tag = document.createElement("script");
      tag.id = SCRIPT_ID;
      tag.src = API_SRC;
      document.head.appendChild(tag);
    }
  });
}

export function YoutubePlayer({ videoId, startSeconds, onProgress, seek }: YoutubePlayerProps) {
  const innerDivRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  // Keep onProgress current without re-running the init effect. Synced in an
  // effect (not during render) to satisfy react-hooks/refs.
  const progressRef = useRef(onProgress);
  useEffect(() => {
    progressRef.current = onProgress;
  });

  // Create the player when the videoId changes (and on mount).
  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    let player: YTPlayer | null = null;

    const clearProgressTimer = () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    loadYouTubeApi().then(() => {
      if (cancelled || !innerDivRef.current || !window.YT) return;

      player = new window.YT.Player(innerDivRef.current, {
        videoId,
        playerVars: { start: Math.floor(startSeconds) },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            if (startSeconds > 0) {
              e.target.seekTo(startSeconds, true);
            }
          },
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) {
              clearProgressTimer();
              intervalId = setInterval(() => {
                const current = player?.getCurrentTime?.() ?? 0;
                const duration = player?.getDuration?.() ?? 0;
                if (duration > 0) {
                  progressRef.current(current, duration);
                }
              }, 1000);
            } else {
              clearProgressTimer();
            }
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      clearProgressTimer();
      playerRef.current = null;
      if (player && typeof player.destroy === "function") {
        player.destroy();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // Chapter seek: jump and play when seek.nonce changes.
  useEffect(() => {
    if (!seek) return;
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(seek.seconds, true);
    player.playVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seek?.nonce]);

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
      {/* The IFrame API replaces this inner div with an <iframe>. */}
      <div ref={innerDivRef} className="w-full h-full" />
    </div>
  );
}

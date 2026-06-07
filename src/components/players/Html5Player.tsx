"use client";

import { useEffect, useRef } from "react";

interface Html5PlayerProps {
  videoId: string; // treated as the video src URL
  startSeconds: number;
  onProgress: (positionSeconds: number, durationSeconds: number) => void;
}

export function Html5Player({ videoId, startSeconds, onProgress }: Html5PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Seek to startSeconds once metadata is loaded
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onLoaded = () => {
      if (startSeconds > 0 && isFinite(el.duration)) {
        el.currentTime = startSeconds;
      }
    };
    el.addEventListener("loadedmetadata", onLoaded);
    return () => el.removeEventListener("loadedmetadata", onLoaded);
  }, [startSeconds]);

  // Fire onProgress on each timeupdate event
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handleTimeUpdate = () => {
      if (isFinite(el.duration) && el.duration > 0) {
        onProgress(el.currentTime, el.duration);
      }
    };
    el.addEventListener("timeupdate", handleTimeUpdate);
    return () => el.removeEventListener("timeupdate", handleTimeUpdate);
  }, [onProgress]);

  return (
    <video
      ref={videoRef}
      src={videoId}
      controls
      className="w-full rounded-xl aspect-video bg-black"
      style={{ maxHeight: "480px" }}
    />
  );
}

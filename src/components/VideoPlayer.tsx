"use client";

import { Html5Player } from "@/components/players/Html5Player";
import { YoutubePlayer } from "@/components/players/YoutubePlayer";
import { VimeoPlayer } from "@/components/players/VimeoPlayer";
import { MuxPlayer } from "@/components/players/MuxPlayer";

export interface VideoPlayerProps {
  provider: string;
  videoId: string;
  startSeconds: number;
  onProgress: (positionSeconds: number, durationSeconds: number) => void;
}

export function VideoPlayer({ provider, videoId, startSeconds, onProgress }: VideoPlayerProps) {
  switch (provider) {
    case "mp4":
    case "html5":
      return (
        <Html5Player
          videoId={videoId}
          startSeconds={startSeconds}
          onProgress={onProgress}
        />
      );
    case "youtube":
      return (
        <YoutubePlayer
          videoId={videoId}
          startSeconds={startSeconds}
          onProgress={onProgress}
        />
      );
    case "vimeo":
      return (
        <VimeoPlayer
          videoId={videoId}
          startSeconds={startSeconds}
          onProgress={onProgress}
        />
      );
    case "mux":
      return (
        <MuxPlayer
          videoId={videoId}
          startSeconds={startSeconds}
          onProgress={onProgress}
        />
      );
    default:
      return (
        <div className="w-full aspect-video rounded-xl bg-black flex items-center justify-center">
          <p className="text-white/60 text-sm">
            Unsupported video provider: <strong>{provider}</strong>
          </p>
        </div>
      );
  }
}

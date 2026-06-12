"use client";

import { VideoPlayer } from "@/components/VideoPlayer";

/** Plays a session recording (an mp4 served from a signed URL). Progress isn't
 *  tracked for recordings — it's just a rewatchable replay. */
export function RecordingPlayer({ url }: { url: string }) {
  return (
    <VideoPlayer
      provider="mp4"
      videoId={url}
      startSeconds={0}
      onProgress={() => {}}
    />
  );
}

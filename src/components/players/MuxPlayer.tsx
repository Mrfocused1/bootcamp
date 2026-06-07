"use client";

interface MuxPlayerProps {
  videoId: string; // Mux playback ID
  startSeconds: number;
  onProgress: (positionSeconds: number, durationSeconds: number) => void;
}

export function MuxPlayer({ videoId, startSeconds }: MuxPlayerProps) {
  // TODO: Wire up Mux player using @mux/mux-player-react:
  //   1. npm install @mux/mux-player-react
  //   2. import MuxPlayer from "@mux/mux-player-react"
  //   3. <MuxPlayerElement playbackId={videoId} startTime={startSeconds}
  //        onTimeUpdate={(e) => onProgress(e.target.currentTime, e.target.duration)} />
  //   The element fires standard HTML media events so wiring onProgress is straightforward.

  const src = `https://stream.mux.com/${videoId}.m3u8`;

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
      <p className="text-white/60 text-sm">
        Mux player — playback ID: {videoId}
        <br />
        <span className="text-xs opacity-60">{src}</span>
        <br />
        <span className="text-xs opacity-60">Start: {startSeconds}s</span>
      </p>
    </div>
  );
}

"use client";

interface VimeoPlayerProps {
  videoId: string;
  startSeconds: number;
  onProgress: (positionSeconds: number, durationSeconds: number) => void;
}

export function VimeoPlayer({ videoId, startSeconds }: VimeoPlayerProps) {
  // TODO: Wire up the Vimeo Player SDK (@vimeo/player) to emit progress events:
  //   1. npm install @vimeo/player
  //   2. Import Player from "@vimeo/player" (client-only).
  //   3. new Player(iframeRef.current) then player.on("timeupdate", ...) to call onProgress.
  //   4. On ready, player.setCurrentTime(startSeconds).

  const src = `https://player.vimeo.com/video/${videoId}#t=${Math.floor(startSeconds)}s`;

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        src={src}
        title="Vimeo video player"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

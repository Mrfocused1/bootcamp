"use client";

interface YoutubePlayerProps {
  videoId: string;
  startSeconds: number;
  onProgress: (positionSeconds: number, durationSeconds: number) => void;
}

export function YoutubePlayer({ videoId, startSeconds }: YoutubePlayerProps) {
  // TODO: Wire up the YouTube IFrame Player API (YT.Player) to emit progress events:
  //   1. Load https://www.youtube.com/iframe_api via a <Script> tag.
  //   2. Create a YT.Player pointing at the iframe.
  //   3. In onStateChange / polling, call onProgress(player.getCurrentTime(), player.getDuration()).
  //   4. On ready, seek to startSeconds via player.seekTo(startSeconds, true).

  const src = `https://www.youtube.com/embed/${videoId}?start=${Math.floor(startSeconds)}&enablejsapi=1`;

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        src={src}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}

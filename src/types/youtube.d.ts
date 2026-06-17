// Minimal typings for the YouTube IFrame Player API loaded at runtime from
// https://www.youtube.com/iframe_api. We only declare the surface the
// YoutubePlayer component uses; `any` for the player instance is acceptable
// (the codebase relies on casts elsewhere too).

export {};

declare global {
  interface Window {
    /** Populated once the IFrame API script has loaded. */
    YT?: {
      Player: new (
        element: HTMLElement | string,
        options: Record<string, unknown>
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    /** The API calls this global once it has finished loading. */
    onYouTubeIframeAPIReady?: () => void;
  }

  /** The runtime player instance. Kept loose on purpose. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type YTPlayer = any;
}

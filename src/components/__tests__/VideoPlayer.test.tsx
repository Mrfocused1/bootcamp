import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { createElement } from "react";
import { VideoPlayer } from "@/components/VideoPlayer";

// ── Mock the Vimeo SDK at module level ──────────────────────────────────────
// Records constructor args and exposes the instance's vi.fn methods so we can
// assert wiring (construction shape + timeupdate handler registration + seek).
const vimeoMock = vi.hoisted(() => {
  const instances: Array<{
    el: unknown;
    options: { id: number; responsive: boolean };
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
    ready: ReturnType<typeof vi.fn>;
    setCurrentTime: ReturnType<typeof vi.fn>;
    play: ReturnType<typeof vi.fn>;
    destroy: ReturnType<typeof vi.fn>;
    // captured "timeupdate" listener
    timeupdate?: (d: { seconds: number; duration: number }) => void;
  }> = [];

  // Regular function (not arrow) so it works as a constructor with `new`.
  function Player(this: Record<string, unknown>, el: unknown, options: { id: number; responsive: boolean }) {
    const inst = {
      el,
      options,
      on: vi.fn((event: string, cb: (d: { seconds: number; duration: number }) => void) => {
        if (event === "timeupdate") inst.timeupdate = cb;
      }),
      off: vi.fn(),
      ready: vi.fn(() => Promise.resolve()),
      setCurrentTime: vi.fn(() => Promise.resolve(0)),
      play: vi.fn(() => Promise.resolve()),
      destroy: vi.fn(() => Promise.resolve()),
      timeupdate: undefined as undefined | ((d: { seconds: number; duration: number }) => void),
    };
    instances.push(inst);
    return inst;
  }

  return { Player, instances };
});

vi.mock("@vimeo/player", () => ({ default: vimeoMock.Player }));

// ── Mock the Mux react component at module level ────────────────────────────
// Renders a simple div and stores the onTimeUpdate handler so we can fire it.
const muxMock = vi.hoisted(() => {
  const captured: {
    playbackId?: string;
    startTime?: number;
    onTimeUpdate?: (e: { currentTarget: { currentTime: number; duration: number } }) => void;
  } = {};
  return { captured };
});

vi.mock("@mux/mux-player-react", () => ({
  default: (props: {
    playbackId?: string;
    startTime?: number;
    onTimeUpdate?: (e: { currentTarget: { currentTime: number; duration: number } }) => void;
  }) => {
    muxMock.captured.playbackId = props.playbackId;
    muxMock.captured.startTime = props.startTime;
    muxMock.captured.onTimeUpdate = props.onTimeUpdate;
    // `createElement` is imported at module top; the factory's returned
    // component only runs at render time, after imports have resolved.
    return createElement("div", { "data-testid": "mux" });
  },
}));

describe("VideoPlayer", () => {
  beforeEach(() => {
    vimeoMock.instances.length = 0;
    muxMock.captured.playbackId = undefined;
    muxMock.captured.startTime = undefined;
    muxMock.captured.onTimeUpdate = undefined;
    // Reset any stubbed YT global between tests.
    delete (window as unknown as { YT?: unknown }).YT;
    delete (window as unknown as { onYouTubeIframeAPIReady?: unknown }).onYouTubeIframeAPIReady;
  });

  // ── mp4 / html5 (Html5Player) — kept from the original suite ──────────────
  it('renders a <video> element when provider is "mp4"', () => {
    const onProgress = vi.fn();
    render(
      <VideoPlayer
        provider="mp4"
        videoId="https://example.com/video.mp4"
        startSeconds={0}
        onProgress={onProgress}
      />
    );
    const video = document.querySelector("video") as HTMLVideoElement | null;
    expect(video).not.toBeNull();
    expect(video!.tagName.toLowerCase()).toBe("video");
    expect(video!.getAttribute("src")).toBe("https://example.com/video.mp4");
  });

  it('renders a <video> element when provider is "html5"', () => {
    render(
      <VideoPlayer
        provider="html5"
        videoId="https://example.com/video.mp4"
        startSeconds={0}
        onProgress={vi.fn()}
      />
    );
    const video = document.querySelector("video");
    expect(video).not.toBeNull();
  });

  it("calls onProgress when a timeupdate event fires on the video element", async () => {
    const onProgress = vi.fn();
    render(
      <VideoPlayer
        provider="mp4"
        videoId="https://example.com/video.mp4"
        startSeconds={0}
        onProgress={onProgress}
      />
    );

    const video = document.querySelector("video") as HTMLVideoElement;
    expect(video).not.toBeNull();

    // jsdom doesn't load real media, so manually set the properties
    Object.defineProperty(video, "currentTime", { value: 30, writable: true, configurable: true });
    Object.defineProperty(video, "duration", { value: 60, writable: true, configurable: true });

    await act(async () => {
      video.dispatchEvent(new Event("timeupdate"));
    });

    expect(onProgress).toHaveBeenCalledWith(30, 60);
  });

  // ── Vimeo (VimeoPlayer) — assert routing + SDK wiring ─────────────────────
  it("routes the vimeo provider through the Vimeo SDK with { id, responsive } and a timeupdate handler", async () => {
    const onProgress = vi.fn();
    await act(async () => {
      render(
        <VideoPlayer provider="vimeo" videoId="76979871" startSeconds={0} onProgress={onProgress} />
      );
    });

    expect(vimeoMock.instances).toHaveLength(1);
    const inst = vimeoMock.instances[0];
    // Constructed with the numeric id + responsive option.
    expect(inst.options).toEqual({ id: 76979871, responsive: true });
    // A timeupdate handler was registered.
    expect(inst.on).toHaveBeenCalledWith("timeupdate", expect.any(Function));

    // Emitting a timeupdate from the SDK forwards to onProgress.
    await act(async () => {
      inst.timeupdate?.({ seconds: 12, duration: 100 });
    });
    expect(onProgress).toHaveBeenCalledWith(12, 100);
  });

  it("seeks the Vimeo player via setCurrentTime when seek.nonce changes", async () => {
    const onProgress = vi.fn();
    const { rerender } = render(
      <VideoPlayer
        provider="vimeo"
        videoId="76979871"
        startSeconds={0}
        onProgress={onProgress}
        seek={null}
      />
    );
    // Let the constructor run.
    await act(async () => {});
    const inst = vimeoMock.instances[0];
    inst.setCurrentTime.mockClear();

    await act(async () => {
      rerender(
        <VideoPlayer
          provider="vimeo"
          videoId="76979871"
          startSeconds={0}
          onProgress={onProgress}
          seek={{ seconds: 42, nonce: 1 }}
        />
      );
    });

    expect(inst.setCurrentTime).toHaveBeenCalledWith(42);
  });

  // ── Mux (MuxPlayer) — assert routing + SDK wiring ─────────────────────────
  it("routes the mux provider through MuxPlayerReact with playbackId/startTime and forwards timeupdate", async () => {
    const onProgress = vi.fn();
    render(
      <VideoPlayer provider="mux" videoId="abc123playback" startSeconds={5} onProgress={onProgress} />
    );

    expect(screen.getByTestId("mux")).toBeInTheDocument();
    expect(muxMock.captured.playbackId).toBe("abc123playback");
    expect(muxMock.captured.startTime).toBe(5);

    // Firing the captured onTimeUpdate forwards to onProgress.
    await act(async () => {
      muxMock.captured.onTimeUpdate?.({ currentTarget: { currentTime: 7, duration: 90 } });
    });
    expect(onProgress).toHaveBeenCalledWith(7, 90);
  });

  // ── YouTube (YoutubePlayer) — stub window.YT and assert construction ──────
  it("routes the youtube provider and constructs a YT.Player against its container", async () => {
    // Stub the IFrame API so jsdom doesn't try to load the real script.
    const seekTo = vi.fn();
    const playVideo = vi.fn();
    const destroy = vi.fn();
    // Must be a regular function (not an arrow) so it works as a constructor
    // with `new`. Explicitly returning an object makes `new` yield it.
    const YTPlayer = vi.fn(function () {
      return { seekTo, playVideo, destroy, getCurrentTime: () => 0, getDuration: () => 0 };
    });
    (window as unknown as { YT: unknown }).YT = {
      Player: YTPlayer,
      PlayerState: { UNSTARTED: -1, ENDED: 0, PLAYING: 1, PAUSED: 2, BUFFERING: 3, CUED: 5 },
    };

    await act(async () => {
      render(
        <VideoPlayer provider="youtube" videoId="dQw4w9WgXcQ" startSeconds={0} onProgress={vi.fn()} />
      );
      // loadYouTubeApi resolves on a microtask when window.YT is already present.
      await Promise.resolve();
    });

    expect(YTPlayer).toHaveBeenCalledTimes(1);
    // Second arg is the options object carrying the videoId. The mock takes no
    // declared params, so index into the recorded call args loosely.
    const callArgs = YTPlayer.mock.calls[0] as unknown[];
    const opts = callArgs[1] as { videoId: string };
    expect(opts.videoId).toBe("dQw4w9WgXcQ");
  });

  // ── Unknown provider — kept from the original suite ───────────────────────
  it("renders an unsupported message for unknown provider", () => {
    render(
      <VideoPlayer
        provider="unknown-provider"
        videoId="foo"
        startSeconds={0}
        onProgress={vi.fn()}
      />
    );
    expect(screen.getByText(/unsupported video provider/i)).toBeInTheDocument();
  });
});

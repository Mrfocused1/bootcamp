import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { VideoPlayer } from "@/components/VideoPlayer";

describe("VideoPlayer", () => {
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

  it("renders a stub placeholder for youtube provider", () => {
    render(
      <VideoPlayer
        provider="youtube"
        videoId="dQw4w9WgXcQ"
        startSeconds={0}
        onProgress={vi.fn()}
      />
    );
    const iframe = document.querySelector("iframe");
    expect(iframe).not.toBeNull();
  });

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

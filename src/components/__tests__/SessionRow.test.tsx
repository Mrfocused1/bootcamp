import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionRow } from "@/components/SessionRow";
import type { LiveSession } from "@/lib/types";

const mockSession: LiveSession = {
  id: "session-1",
  day_index: 4,
  scheduled_at: "2026-06-10T18:00:00Z",
  zoom_url: "https://zoom.us/j/999",
};

describe("SessionRow", () => {
  it("renders the day index in the heading", () => {
    render(<SessionRow session={mockSession} />);
    expect(screen.getByText(/day 4 live session/i)).toBeInTheDocument();
  });

  it("renders a Join Zoom link pointing to the zoom_url", () => {
    render(<SessionRow session={mockSession} />);
    const link = screen.getByRole("link", { name: /join zoom/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://zoom.us/j/999");
  });

  it("renders the formatted scheduled date", () => {
    render(<SessionRow session={mockSession} />);
    // The date should appear somewhere in the rendered output
    const dateText = screen.getByText(/june/i);
    expect(dateText).toBeInTheDocument();
  });
});

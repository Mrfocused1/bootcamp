import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DayCard } from "@/components/DayCard";
import type { Day, Progress } from "@/lib/types";

const mockDay: Day = {
  id: "day-1",
  day_index: 1,
  title: "Build the look",
  description: "Learn to clone websites and generate AI images.",
};

const completedProgress: Progress = {
  lesson_id: "lesson-1",
  last_position_seconds: 3600,
  watched_percent: 100,
  completed: true,
};

const inProgressProgress: Progress = {
  lesson_id: "lesson-1",
  last_position_seconds: 1800,
  watched_percent: 45,
  completed: false,
};

describe("DayCard", () => {
  it("renders completed state", () => {
    render(
      <DayCard
        day={mockDay}
        progress={completedProgress}
        unlocked={true}
        unlockDateStr="Monday, June 1"
      />
    );
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    // Should be a link (unlocked)
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders in-progress state", () => {
    render(
      <DayCard
        day={mockDay}
        progress={inProgressProgress}
        unlocked={true}
        unlockDateStr="Monday, June 1"
      />
    );
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders not-started state", () => {
    render(
      <DayCard
        day={mockDay}
        progress={undefined}
        unlocked={true}
        unlockDateStr="Monday, June 1"
      />
    );
    expect(screen.getByText(/not started/i)).toBeInTheDocument();
    expect(screen.getByRole("link")).toBeInTheDocument();
  });

  it("renders locked state — no link, shows unlock date", () => {
    render(
      <DayCard
        day={mockDay}
        progress={undefined}
        unlocked={false}
        unlockDateStr="Friday, June 5"
      />
    );
    expect(screen.getByText(/locked/i)).toBeInTheDocument();
    expect(screen.getByText(/Friday, June 5/)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders the day title", () => {
    render(
      <DayCard
        day={mockDay}
        progress={undefined}
        unlocked={true}
        unlockDateStr="Monday, June 1"
      />
    );
    expect(screen.getByText("Build the look")).toBeInTheDocument();
  });
});

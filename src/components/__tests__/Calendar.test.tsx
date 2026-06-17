import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Calendar } from "@/components/Calendar";

// Today is 2026-06-07 (Sunday). June 2026 starts on Monday.
const TODAY = "2026-06-07";

describe("Calendar", () => {
  it("renders some day numbers for the current month", () => {
    render(<Calendar selected={null} onSelect={() => {}} todayISO={TODAY} />);
    // June 2026 has days 1-30; check a few
    expect(screen.getByLabelText("2026-06-07")).toBeInTheDocument();
    expect(screen.getByLabelText("2026-06-30")).toBeInTheDocument();
  });

  it("displays the correct month and year", () => {
    render(<Calendar selected={null} onSelect={() => {}} todayISO={TODAY} />);
    expect(screen.getByText("June 2026")).toBeInTheDocument();
  });

  it("renders weekday labels", () => {
    render(<Calendar selected={null} onSelect={() => {}} todayISO={TODAY} />);
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Sun")).toBeInTheDocument();
  });

  it("calls onSelect with the ISO string when a future day is clicked", () => {
    const onSelect = vi.fn();
    render(<Calendar selected={null} onSelect={onSelect} todayISO={TODAY} />);
    // 2026-06-10 is after today (2026-06-07)
    fireEvent.click(screen.getByLabelText("2026-06-10"));
    expect(onSelect).toHaveBeenCalledWith("2026-06-10");
  });

  it("calls onSelect when today is clicked", () => {
    const onSelect = vi.fn();
    render(<Calendar selected={null} onSelect={onSelect} todayISO={TODAY} />);
    fireEvent.click(screen.getByLabelText(TODAY));
    expect(onSelect).toHaveBeenCalledWith(TODAY);
  });

  it("does NOT call onSelect when a past day is clicked", () => {
    const onSelect = vi.fn();
    render(<Calendar selected={null} onSelect={onSelect} todayISO={TODAY} />);
    // 2026-06-01 is before TODAY
    const pastBtn = screen.getByLabelText("2026-06-01");
    fireEvent.click(pastBtn);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("past day button is disabled", () => {
    render(<Calendar selected={null} onSelect={() => {}} todayISO={TODAY} />);
    const pastBtn = screen.getByLabelText("2026-06-01") as HTMLButtonElement;
    expect(pastBtn.disabled).toBe(true);
  });

  it("selected date has aria-pressed=true", () => {
    render(
      <Calendar selected="2026-06-10" onSelect={() => {}} todayISO={TODAY} />
    );
    const btn = screen.getByLabelText("2026-06-10");
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("non-selected date has aria-pressed=false", () => {
    render(
      <Calendar selected="2026-06-10" onSelect={() => {}} todayISO={TODAY} />
    );
    const btn = screen.getByLabelText("2026-06-15");
    expect(btn).toHaveAttribute("aria-pressed", "false");
  });

  it("clicking prev month button shows previous month", () => {
    render(<Calendar selected={null} onSelect={() => {}} todayISO={TODAY} />);
    expect(screen.getByText("June 2026")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Previous month"));
    expect(screen.getByText("May 2026")).toBeInTheDocument();
  });

  it("clicking next month button shows next month", () => {
    render(<Calendar selected={null} onSelect={() => {}} todayISO={TODAY} />);
    expect(screen.getByText("June 2026")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Next month"));
    expect(screen.getByText("July 2026")).toBeInTheDocument();
  });

  it("wraps prev month across year boundary", () => {
    render(<Calendar selected={null} onSelect={() => {}} todayISO="2026-01-15" />);
    expect(screen.getByText("January 2026")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Previous month"));
    expect(screen.getByText("December 2025")).toBeInTheDocument();
  });

  it("wraps next month across year boundary", () => {
    render(<Calendar selected={null} onSelect={() => {}} todayISO="2026-12-01" />);
    fireEvent.click(screen.getByLabelText("Next month"));
    expect(screen.getByText("January 2027")).toBeInTheDocument();
  });
});

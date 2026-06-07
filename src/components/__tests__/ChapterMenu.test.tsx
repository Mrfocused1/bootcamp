import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChapterMenu } from "@/components/ChapterMenu";
import type { Chapter } from "@/lib/types";

const CHAPTERS: Chapter[] = [
  { title: "Intro & setup", start_seconds: 0 },
  { title: "Cursor basics", start_seconds: 60 },
  { title: "Cloning a website", start_seconds: 180 },
];

function openDropdown() {
  fireEvent.click(screen.getByRole("button", { name: /chapters/i }));
}

describe("ChapterMenu", () => {
  it("renders nothing when chapters array is empty", () => {
    const { container } = render(<ChapterMenu chapters={[]} onSelect={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a trigger button and no chapter rows when closed", () => {
    render(<ChapterMenu chapters={CHAPTERS} onSelect={vi.fn()} />);
    expect(screen.getByRole("button", { name: /chapters/i })).toBeInTheDocument();
    // Chapter titles should not be visible until opened
    expect(screen.queryByText("Intro & setup")).not.toBeInTheDocument();
  });

  it("shows each chapter title after opening the dropdown", () => {
    render(<ChapterMenu chapters={CHAPTERS} onSelect={vi.fn()} />);
    openDropdown();
    expect(screen.getByText("Intro & setup")).toBeInTheDocument();
    expect(screen.getByText("Cursor basics")).toBeInTheDocument();
    expect(screen.getByText("Cloning a website")).toBeInTheDocument();
  });

  it("shows formatted timestamps after opening the dropdown", () => {
    render(<ChapterMenu chapters={CHAPTERS} onSelect={vi.fn()} />);
    openDropdown();
    // 0 → "0:00", 60 → "1:00", 180 → "3:00"
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(screen.getByText("1:00")).toBeInTheDocument();
    expect(screen.getByText("3:00")).toBeInTheDocument();
  });

  it("calls onSelect with the correct start_seconds when a chapter row is clicked", () => {
    const onSelect = vi.fn();
    render(<ChapterMenu chapters={CHAPTERS} onSelect={onSelect} />);
    openDropdown();
    fireEvent.click(screen.getByText("Cursor basics"));
    expect(onSelect).toHaveBeenCalledWith(60);
  });

  it("calls onSelect with 0 when the first chapter is clicked", () => {
    const onSelect = vi.fn();
    render(<ChapterMenu chapters={CHAPTERS} onSelect={onSelect} />);
    openDropdown();
    fireEvent.click(screen.getByText("Intro & setup"));
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("closes the dropdown after a chapter row is clicked", () => {
    render(<ChapterMenu chapters={CHAPTERS} onSelect={vi.fn()} />);
    openDropdown();
    expect(screen.getByText("Cursor basics")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cursor basics"));
    expect(screen.queryByText("Cursor basics")).not.toBeInTheDocument();
  });

  it("closes the dropdown on Escape key", () => {
    render(<ChapterMenu chapters={CHAPTERS} onSelect={vi.fn()} />);
    openDropdown();
    expect(screen.getByText("Intro & setup")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Intro & setup")).not.toBeInTheDocument();
  });

  it("trigger button has aria-haspopup and aria-expanded attributes", () => {
    render(<ChapterMenu chapters={CHAPTERS} onSelect={vi.fn()} />);
    const trigger = screen.getByRole("button", { name: /chapters/i });
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    openDropdown();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});

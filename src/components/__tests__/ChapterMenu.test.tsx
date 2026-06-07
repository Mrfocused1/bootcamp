import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChapterMenu } from "@/components/ChapterMenu";
import type { Chapter } from "@/lib/types";

const CHAPTERS: Chapter[] = [
  { title: "Intro & setup", start_seconds: 0 },
  { title: "Cursor basics", start_seconds: 60 },
  { title: "Cloning a website", start_seconds: 180 },
];

describe("ChapterMenu", () => {
  it("renders each chapter title", () => {
    render(<ChapterMenu chapters={CHAPTERS} onSelect={vi.fn()} />);
    expect(screen.getByText(/Intro & setup/)).toBeInTheDocument();
    expect(screen.getByText(/Cursor basics/)).toBeInTheDocument();
    expect(screen.getByText(/Cloning a website/)).toBeInTheDocument();
  });

  it("renders formatted timestamps for each chapter", () => {
    render(<ChapterMenu chapters={CHAPTERS} onSelect={vi.fn()} />);
    // 0 → "0:00", 60 → "1:00", 180 → "3:00"
    expect(screen.getByText(/0:00/)).toBeInTheDocument();
    expect(screen.getByText(/1:00/)).toBeInTheDocument();
    expect(screen.getByText(/3:00/)).toBeInTheDocument();
  });

  it("calls onSelect with the chapter's start_seconds when a chapter is chosen", () => {
    const onSelect = vi.fn();
    render(<ChapterMenu chapters={CHAPTERS} onSelect={onSelect} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "60" } });
    expect(onSelect).toHaveBeenCalledWith(60);
  });

  it("calls onSelect with 0 when the first chapter is chosen", () => {
    const onSelect = vi.fn();
    render(<ChapterMenu chapters={CHAPTERS} onSelect={onSelect} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "0" } });
    expect(onSelect).toHaveBeenCalledWith(0);
  });

  it("renders nothing when chapters array is empty", () => {
    const { container } = render(<ChapterMenu chapters={[]} onSelect={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});

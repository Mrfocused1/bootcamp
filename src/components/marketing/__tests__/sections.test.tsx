import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Syllabus } from "../sections/Syllabus";

describe("home sections", () => {
  it("Syllabus renders all 5 days and a link to the full syllabus", () => {
    render(<Syllabus />);
    for (const d of ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]) {
      expect(screen.getByText(d)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /full syllabus/i })).toHaveAttribute("href", "/syllabus");
  });
});

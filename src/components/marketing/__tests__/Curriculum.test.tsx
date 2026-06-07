import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Curriculum } from "../sections/Curriculum";

describe("Curriculum", () => {
  it("renders the heading and all five days", () => {
    render(<Curriculum />);
    expect(screen.getByRole("heading", { name: /what you'll learn/i })).toBeInTheDocument();
    // Each day is rendered in both layouts (desktop hover-fan + mobile stack),
    // so the content appears more than once in the DOM.
    for (const d of ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]) {
      expect(screen.getAllByText(new RegExp(d, "i")).length).toBeGreaterThan(0);
    }
    expect(screen.getAllByText(/Take payments with Stripe/i).length).toBeGreaterThan(0);
  });
});

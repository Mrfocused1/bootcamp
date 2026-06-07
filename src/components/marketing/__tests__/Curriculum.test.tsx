import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Curriculum } from "../sections/Curriculum";

describe("Curriculum", () => {
  it("renders the heading and all five days", () => {
    render(<Curriculum />);
    expect(screen.getByRole("heading", { name: /what you'll learn/i })).toBeInTheDocument();
    for (const d of ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]) {
      expect(screen.getByText(new RegExp(d, "i"))).toBeInTheDocument();
    }
    expect(screen.getByText(/Take payments with Stripe/i)).toBeInTheDocument();
  });
});

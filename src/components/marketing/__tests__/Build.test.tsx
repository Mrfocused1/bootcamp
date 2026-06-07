import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Build } from "../sections/Build";

describe("Build", () => {
  it("renders the heading and project cards", () => {
    render(<Build />);
    expect(screen.getByRole("heading", { name: /what you'll build/i })).toBeInTheDocument();
    expect(screen.getByText("AI meal-planning app")).toBeInTheDocument();
    expect(screen.getByText("Coffee subscription store")).toBeInTheDocument();
    expect(screen.getAllByText(/view project/i).length).toBeGreaterThan(5);
  });
});

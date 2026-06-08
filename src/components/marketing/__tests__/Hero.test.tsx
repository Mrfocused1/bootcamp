import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "../Hero";

describe("Hero", () => {
  it("renders the full heading and the enrol CTA", () => {
    render(<Hero />);
    // Words render in individual inline-block spans (for the stagger animation),
    // so normalize whitespace before asserting the readable sentence.
    const heading = screen
      .getByRole("heading")
      .textContent?.toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    expect(heading).toContain("we teach you how to build premium websites powered by ai");
    expect(screen.getByRole("link", { name: /enrol now/i })).toHaveAttribute("href", "/pricing");
  });

  it("renders the hero image with alt text", () => {
    render(<Hero />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", expect.stringMatching(/learning/i));
  });
});

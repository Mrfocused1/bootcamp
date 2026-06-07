import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "../Hero";

describe("Hero", () => {
  it("renders the full heading and the enrol CTA", () => {
    render(<Hero />);
    expect(screen.getByRole("heading").textContent?.toLowerCase()).toContain(
      "we teach you how to build real websites powered by ai",
    );
    expect(screen.getByRole("link", { name: /enrol now/i })).toHaveAttribute("href", "/pricing");
  });

  it("renders the hero image with alt text", () => {
    render(<Hero />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", expect.stringMatching(/learning/i));
  });
});

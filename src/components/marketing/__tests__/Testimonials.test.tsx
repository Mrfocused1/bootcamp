import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Testimonials } from "../sections/Testimonials";

describe("Testimonials", () => {
  it("renders the heading", () => {
    render(<Testimonials />);
    expect(
      screen.getByRole("heading").textContent?.replace(/\s+/g, " "),
    ).toMatch(/meet the people who shipped a real website in 5 days\. proud of them!/i);
  });

  it("renders placeholder photos for both layouts", () => {
    const { container } = render(<Testimonials />);
    // Each of the 6 photos renders in both the desktop and mobile collage.
    expect(container.querySelectorAll("img").length).toBeGreaterThanOrEqual(12);
  });
});

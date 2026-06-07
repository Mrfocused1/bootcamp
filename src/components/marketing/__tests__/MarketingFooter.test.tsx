import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MarketingFooter } from "../MarketingFooter";

describe("MarketingFooter", () => {
  it("includes an FAQ link", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/faq");
  });

  it("shows the enrol CTA and the wordmark", () => {
    render(<MarketingFooter />);
    expect(screen.getByRole("link", { name: /enrol now/i })).toHaveAttribute("href", "/pricing");
    expect(screen.getByText("Bridgeway AI Bootcamp")).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MarketingNav } from "../MarketingNav";

describe("MarketingNav", () => {
  it("renders the wordmark and a login link", () => {
    render(<MarketingNav />);
    expect(screen.getByText("Bridgeway AI Bootcamp")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/login");
  });

  it("does not show nav links until the menu is opened", () => {
    render(<MarketingNav />);
    expect(screen.queryByRole("link", { name: "Pricing" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /menu/i }));
    expect(screen.getByRole("link", { name: "Pricing" })).toHaveAttribute("href", "/pricing");
  });

  it("does NOT include an FAQ link in the menu", () => {
    render(<MarketingNav />);
    fireEvent.click(screen.getByRole("button", { name: /menu/i }));
    expect(screen.queryByRole("link", { name: "FAQ" })).not.toBeInTheDocument();
  });

  it("closes the menu when a nav link is clicked", () => {
    render(<MarketingNav />);
    fireEvent.click(screen.getByRole("button", { name: /menu/i }));
    const link = screen.getByRole("link", { name: "Pricing" });
    fireEvent.click(link);
    expect(screen.queryByRole("link", { name: "Pricing" })).not.toBeInTheDocument();
  });
});

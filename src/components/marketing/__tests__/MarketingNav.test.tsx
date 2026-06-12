import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MarketingNav } from "../MarketingNav";

describe("MarketingNav", () => {
  it("renders the brand logo (home link) and a login link", () => {
    const { container } = render(<MarketingNav />);
    const homeLinks = container.querySelectorAll('a[aria-label="Bridgeway AI Bootcamp"]');
    expect(homeLinks.length).toBeGreaterThan(0);
    homeLinks.forEach((l) => expect(l).toHaveAttribute("href", "/"));
    expect(container.querySelector('a[href="/login"]')).toBeInTheDocument();
  });

  it("toggles aria-expanded when the menu opens and closes", () => {
    const { container } = render(<MarketingNav />);
    const menuBtn = screen.getByRole("button", { name: /^menu$/i });
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(container.querySelector('button[aria-label="close menu"]')!);
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("includes the expected nav links and NOT an FAQ link", () => {
    const { container } = render(<MarketingNav />);
    expect(container.querySelector('#nav-menu a[href="/pricing"]')).toBeInTheDocument();
    expect(container.querySelector('#nav-menu a[href="/success-stories"]')).toBeInTheDocument();
    expect(container.querySelector('#nav-menu a[href="/faq"]')).not.toBeInTheDocument();
  });

  it("closes the menu when a nav link is clicked", () => {
    const { container } = render(<MarketingNav />);
    const menuBtn = screen.getByRole("button", { name: /^menu$/i });
    fireEvent.click(menuBtn);
    expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(container.querySelector('#nav-menu a[href="/pricing"]')!);
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");
  });
});

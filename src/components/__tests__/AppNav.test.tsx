import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavLinks } from "@/components/NavLinks";

describe("NavLinks", () => {
  it("renders Dashboard and Schedule links for a student", () => {
    render(<NavLinks role="student" />);
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /schedule/i })).toBeInTheDocument();
  });

  it("does NOT render Admin link for a student", () => {
    render(<NavLinks role="student" />);
    expect(screen.queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
  });

  it("renders Admin link for an admin", () => {
    render(<NavLinks role="admin" />);
    expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
  });

  it("renders Dashboard and Schedule links for an admin", () => {
    render(<NavLinks role="admin" />);
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /schedule/i })).toBeInTheDocument();
  });

  it("renders Book link for a student", () => {
    render(<NavLinks role="student" />);
    expect(screen.getByRole("link", { name: /book/i })).toBeInTheDocument();
  });

  it("renders Book link for an admin", () => {
    render(<NavLinks role="admin" />);
    expect(screen.getByRole("link", { name: /book/i })).toBeInTheDocument();
  });
});

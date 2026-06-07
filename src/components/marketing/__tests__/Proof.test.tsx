import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Proof } from "../sections/Proof";

describe("Proof", () => {
  it("renders the results statement", () => {
    render(<Proof />);
    expect(screen.getByRole("heading").textContent?.toLowerCase()).toContain("real websites");
    expect(screen.getByText(/not to brag/i)).toBeInTheDocument();
  });
});

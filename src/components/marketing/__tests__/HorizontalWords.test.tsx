import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HorizontalWords } from "../sections/HorizontalWords";

describe("HorizontalWords", () => {
  it("renders the statement headline and the sub-line", () => {
    render(<HorizontalWords />);
    expect(screen.getByRole("heading")).toHaveTextContent(
      "No code. No agency. Just you and AI.",
    );
    expect(
      screen.getByText(/build and launch a real website yourself/i),
    ).toBeInTheDocument();
  });
});

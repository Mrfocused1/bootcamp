import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Future } from "../sections/Future";

describe("Future", () => {
  it("renders the title (bold + serif italic line) and the paragraph", () => {
    render(<Future />);
    expect(screen.getByRole("heading").textContent?.replace(/\s+/g, " ")).toMatch(
      /A course built for the AI era\. from idea to live site\./i,
    );
    expect(screen.getByText(/Every session is recorded/i)).toBeInTheDocument();
  });
});

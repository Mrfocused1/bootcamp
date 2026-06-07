import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Future } from "../sections/Future";

describe("Future", () => {
  it("renders the title, the three flying tags and the paragraph", () => {
    render(<Future />);
    expect(screen.getByRole("heading")).toHaveTextContent(/A course built for the AI era/i);
    expect(screen.getByText("no code required!")).toBeInTheDocument();
    expect(screen.getByText(/AI is your unfair advantage/i)).toBeInTheDocument();
    expect(screen.getByText(/Every session is recorded/i)).toBeInTheDocument();
  });
});

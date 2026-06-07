import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Scribble } from "../Scribble";

describe("Scribble", () => {
  it("renders an svg path with the given color", () => {
    const { container } = render(<Scribble color="#4b69f0" />);
    const path = container.querySelector("path");
    expect(path).not.toBeNull();
    expect(path).toHaveAttribute("stroke", "#4b69f0");
  });
});

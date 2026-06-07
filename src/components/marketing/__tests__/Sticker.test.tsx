import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Sticker } from "../Sticker";

describe("Sticker", () => {
  it("renders the image from the marketing stickers path", () => {
    render(<Sticker name="thumbs-up" alt="thumbs up" />);
    expect(screen.getByRole("img", { name: "thumbs up" })).toHaveAttribute(
      "src",
      "/marketing/stickers/thumbs-up.png",
    );
  });

  it("is decorative (aria-hidden) when no alt is given", () => {
    const { container } = render(<Sticker name="heart" />);
    expect(container.querySelector("img")).toHaveAttribute("aria-hidden", "true");
  });
});

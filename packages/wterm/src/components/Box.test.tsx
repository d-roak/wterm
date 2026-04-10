import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Box } from "./Box";

describe("Box", () => {
  it("renders title and children", () => {
    render(<Box title="Settings">hello</Box>);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("applies double border attribute", () => {
    const { container } = render(<Box double>x</Box>);
    expect(container.querySelector(".tui-box")).toHaveAttribute("data-double", "true");
  });
});

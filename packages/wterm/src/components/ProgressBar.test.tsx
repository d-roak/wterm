import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders correct percentage", () => {
    render(<ProgressBar value={0.5} width={10} />);
    expect(screen.getByLabelText("Progress 50%")).toBeInTheDocument();
  });

  it("clamps out-of-range values", () => {
    render(<ProgressBar value={2} width={10} />);
    expect(screen.getByLabelText("Progress 100%")).toBeInTheDocument();
  });
});

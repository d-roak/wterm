import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("calls onChange on typing", async () => {
    const onChange = vi.fn();
    render(<Input label="Name" value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText("Name"), "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });
});

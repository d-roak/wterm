import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";
import { renderWithNav } from "../test/utils";

describe("Checkbox", () => {
  it("toggles value on click", async () => {
    const onChange = vi.fn();
    renderWithNav(<Checkbox label="Wrap" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByText("Wrap"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("reflects checked state via data attr", () => {
    const { container } = renderWithNav(
      <Checkbox label="Wrap" checked onChange={() => {}} />
    );
    expect(container.querySelector(".tui-check")).toHaveAttribute("data-checked", "true");
  });
});

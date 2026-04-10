import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Radio } from "./Radio";
import { renderWithNav } from "../test/utils";

describe("Radio", () => {
  it("emits the chosen value", async () => {
    const onChange = vi.fn();
    renderWithNav(
      <Radio
        name="size"
        value="a"
        options={[
          { value: "a", label: "Small" },
          { value: "b", label: "Medium" },
        ]}
        onChange={onChange}
      />
    );
    await userEvent.click(screen.getByText("Medium"));
    expect(onChange).toHaveBeenCalledWith("b");
  });
});

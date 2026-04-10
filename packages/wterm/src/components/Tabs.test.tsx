import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";
import { renderWithNav } from "../test/utils";

describe("Tabs", () => {
  it("changes active tab on click", async () => {
    const onChange = vi.fn();
    renderWithNav(
      <Tabs
        activeId="a"
        onChange={onChange}
        tabs={[
          { id: "a", label: "A", content: <div>aaa</div> },
          { id: "b", label: "B", content: <div>bbb</div> },
        ]}
      />
    );
    expect(screen.getByText("aaa")).toBeInTheDocument();
    await userEvent.click(screen.getByText("B"));
    expect(onChange).toHaveBeenCalledWith("b");
  });
});

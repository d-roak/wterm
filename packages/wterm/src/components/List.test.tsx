import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { List } from "./List";
import { renderWithNav } from "../test/utils";

describe("List", () => {
  it("selects an item on click", async () => {
    const onSelect = vi.fn();
    renderWithNav(
      <List
        items={[
          { id: "one", label: "One" },
          { id: "two", label: "Two" },
        ]}
        onSelect={onSelect}
      />
    );
    await userEvent.click(screen.getByText("Two"));
    expect(onSelect).toHaveBeenCalledWith("two");
  });

  it("marks selectedId with aria-selected", () => {
    renderWithNav(
      <List
        items={[
          { id: "one", label: "One" },
          { id: "two", label: "Two" },
        ]}
        selectedId="two"
        onSelect={() => {}}
      />
    );
    expect(screen.getByText("Two")).toHaveAttribute("aria-selected", "true");
  });
});

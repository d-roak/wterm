import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";
import { renderWithNav } from "../test/utils";

describe("Button", () => {
  it("calls onSelect when clicked", async () => {
    const onSelect = vi.fn();
    renderWithNav(<Button label="Save" onSelect={onSelect} />);
    await userEvent.click(screen.getByText("Save"));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("calls onSelect when Enter pressed", async () => {
    const onSelect = vi.fn();
    renderWithNav(<Button label="Save" onSelect={onSelect} />);
    const btn = screen.getByText("Save");
    btn.focus();
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("calls onSelect when Space pressed", async () => {
    const onSelect = vi.fn();
    renderWithNav(<Button label="Save" onSelect={onSelect} />);
    const btn = screen.getByText("Save");
    btn.focus();
    await userEvent.keyboard(" ");
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("does not fire when disabled", async () => {
    const onSelect = vi.fn();
    renderWithNav(<Button label="Save" onSelect={onSelect} disabled />);
    await userEvent.click(screen.getByText("Save"));
    expect(onSelect).not.toHaveBeenCalled();
  });
});

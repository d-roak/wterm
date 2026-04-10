import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../components/Button";
import { renderWithNav } from "../test/utils";

describe("NavProvider + cmdk palette", () => {
  it("opens the palette on Cmd+K and runs the matching command", async () => {
    const onSelect = vi.fn();
    renderWithNav(<Button label="Save File" onSelect={onSelect} />);
    await userEvent.keyboard("{Meta>}k{/Meta}");
    const input = await screen.findByPlaceholderText("Type a command...");
    await userEvent.type(input, "Save");
    await userEvent.keyboard("{Enter}");
    expect(onSelect).toHaveBeenCalled();
  });

  it("closes the palette on Escape", async () => {
    renderWithNav(<Button label="X" onSelect={() => {}} />);
    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(await screen.findByPlaceholderText("Type a command...")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByPlaceholderText("Type a command...")).not.toBeInTheDocument();
  });
});

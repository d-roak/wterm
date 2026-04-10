import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./Modal";
import { renderWithNav } from "../test/utils";

describe("Modal", () => {
  it("renders message when open", () => {
    renderWithNav(<Modal open message="Hello world" onClose={() => {}} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    renderWithNav(<Modal open={false} message="Hidden" onClose={() => {}} />);
    expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
  });

  it("calls onClose when OK clicked", async () => {
    const onClose = vi.fn();
    renderWithNav(<Modal open message="msg" onClose={onClose} />);
    await userEvent.click(screen.getByText("OK"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose on Escape", async () => {
    const onClose = vi.fn();
    renderWithNav(<Modal open message="msg" onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("renders title when provided", () => {
    renderWithNav(<Modal open title="Info" message="msg" onClose={() => {}} />);
    expect(screen.getByText("Info")).toBeInTheDocument();
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("renders content when open", () => {
    render(
      <Dialog open title="hi" onClose={() => {}}>
        body
      </Dialog>
    );
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("renders nothing when closed", () => {
    render(
      <Dialog open={false} onClose={() => {}}>
        body
      </Dialog>
    );
    expect(screen.queryByText("body")).not.toBeInTheDocument();
  });

  it("calls onClose on Escape", async () => {
    const onClose = vi.fn();
    render(
      <Dialog open onClose={onClose}>
        body
      </Dialog>
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});

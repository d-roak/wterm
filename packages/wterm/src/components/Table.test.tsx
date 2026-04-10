import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table } from "./Table";

describe("Table", () => {
  it("renders headers and rows", () => {
    render(
      <Table
        columns={[
          { key: "name", header: "Name" },
          { key: "role", header: "Role" },
        ]}
        rows={[
          { name: "ada", role: "admin" },
          { name: "linus", role: "user" },
        ]}
      />
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("ada")).toBeInTheDocument();
    expect(screen.getByText("linus")).toBeInTheDocument();
  });
});

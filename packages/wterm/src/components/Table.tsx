import * as React from "react";

export type Column<T> = { key: keyof T & string; header: string };
export type TableProps<T> = {
  columns: Column<T>[];
  rows: T[];
};

export function Table<T extends Record<string, React.ReactNode>>({ columns, rows }: TableProps<T>) {
  return (
    <table className="tui-table">
      <thead>
        <tr>{columns.map((c) => <th key={c.key}>{c.header}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{columns.map((c) => <td key={c.key}>{r[c.key]}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

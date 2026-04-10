import * as React from "react";

export type StatusBarProps = {
  items: React.ReactNode[];
};

export function StatusBar({ items }: StatusBarProps) {
  return (
    <div className="tui-statusbar">
      {items.map((it, i) => (
        <span key={i}>{it}</span>
      ))}
    </div>
  );
}

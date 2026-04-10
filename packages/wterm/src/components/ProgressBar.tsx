import * as React from "react";

export type ProgressBarProps = {
  value: number; // 0..1
  width?: number; // chars
};

export function ProgressBar({ value, width = 20 }: ProgressBarProps) {
  const v = Math.max(0, Math.min(1, value));
  const filled = Math.round(v * width);
  const empty = width - filled;
  return (
    <span className="tui-progress" aria-label={`Progress ${Math.round(v * 100)}%`}>
      [{"█".repeat(filled)}{"░".repeat(empty)}] {Math.round(v * 100)}%
    </span>
  );
}

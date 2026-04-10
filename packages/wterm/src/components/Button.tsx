import * as React from "react";
import { useFocusable } from "../nav/useFocusable";

export type ButtonProps = {
  label: string;
  onSelect: () => void;
  group?: string;
  disabled?: boolean;
};

export function Button({ label, onSelect, group, disabled }: ButtonProps) {
  const f = useFocusable({ label, onSelect, group, disabled });
  return (
    <span {...f} className={`${f.className} tui-button`}>
      {label}
    </span>
  );
}

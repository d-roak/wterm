import * as React from "react";
import { useFocusable } from "../nav/useFocusable";

export type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  group?: string;
};

export function Checkbox({ label, checked, onChange, group }: CheckboxProps) {
  const f = useFocusable({ label, group, onSelect: () => onChange(!checked) });
  return (
    <span {...f} className={`${f.className} tui-check`} data-checked={checked}>
      <span className="tui-check-mark" /> {label}
    </span>
  );
}

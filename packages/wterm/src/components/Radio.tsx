import * as React from "react";
import { useFocusable } from "../nav/useFocusable";

export type RadioProps<T extends string> = {
  name: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
};

export function Radio<T extends string>({ name, value, options, onChange }: RadioProps<T>) {
  return (
    <div role="radiogroup" aria-label={name} style={{ display: "flex", flexDirection: "column" }}>
      {options.map((o) => (
        <RadioItem
          key={o.value}
          label={o.label}
          checked={value === o.value}
          group={name}
          onSelect={() => onChange(o.value)}
        />
      ))}
    </div>
  );
}

function RadioItem({
  label, checked, group, onSelect,
}: { label: string; checked: boolean; group: string; onSelect: () => void }) {
  const f = useFocusable({ label, group, onSelect });
  return (
    <span {...f} className={`${f.className} tui-radio`} data-checked={checked}>
      <span className="tui-radio-mark" /> {label}
    </span>
  );
}

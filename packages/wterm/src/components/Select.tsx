import * as React from "react";
import { Box } from "./Box";
import { List } from "./List";
import { useFocusable } from "../nav/useFocusable";

export type SelectOption = { value: string; label: string };
export type SelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (v: string) => void;
};

export function Select({ label, value, options, onChange }: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const current = options.find((o) => o.value === value);
  const f = useFocusable({
    label: `${label}: ${current?.label ?? "—"}`,
    group: "Select",
    onSelect: () => setOpen((o) => !o),
  });
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span {...f}>
        {label}: {current?.label ?? "—"} ▾
      </span>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, zIndex: 10 }}>
          <Box>
            <List
              items={options.map((o) => ({ id: o.value, label: o.label }))}
              selectedId={value}
              group={label}
              onSelect={(id) => {
                onChange(id);
                setOpen(false);
              }}
            />
          </Box>
        </div>
      )}
    </span>
  );
}

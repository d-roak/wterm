import * as React from "react";

export type InputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
};

export function Input({ value, onChange, placeholder, label }: InputProps) {
  return (
    <label style={{ display: "block" }}>
      {label && <div style={{ color: "var(--tui-muted)" }}>{label}</div>}
      <input
        className="tui-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

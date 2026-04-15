import * as React from "react";

export type InputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  type?: React.HTMLInputTypeAttribute;
};

export function Input({ value, onChange, placeholder, label, type }: InputProps) {
  return (
    <label style={{ display: "block" }}>
      {label && <div style={{ color: "var(--tui-muted)" }}>{label}</div>}
      <input
        className="tui-input"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

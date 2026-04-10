import * as React from "react";
import { useNav } from "./NavProvider";

let uid = 0;
const nextId = () => `f${++uid}`;

export type UseFocusableOpts = {
  label: string;
  onSelect: () => void;
  group?: string;
  disabled?: boolean;
};

/**
 * Registers an interactive element with the command palette and returns
 * props that wire up click + keyboard activation. Use on every interactive
 * component so keyboard and mouse paths are identical.
 */
export function useFocusable({ label, onSelect, group, disabled }: UseFocusableOpts) {
  const { register } = useNav();
  const idRef = React.useRef<string>("");
  if (!idRef.current) idRef.current = nextId();

  // Keep latest onSelect without re-registering on every render.
  const selectRef = React.useRef(onSelect);
  selectRef.current = onSelect;

  React.useEffect(() => {
    if (disabled) return;
    return register({
      id: idRef.current,
      label,
      group,
      onSelect: () => selectRef.current(),
    });
  }, [register, label, group, disabled]);

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    selectRef.current();
  };
  const handleKey = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectRef.current();
    }
  };

  return {
    role: "button" as const,
    tabIndex: disabled ? -1 : 0,
    "aria-disabled": disabled || undefined,
    onClick: handleClick,
    onKeyDown: handleKey,
    className: "tui-focusable",
  };
}

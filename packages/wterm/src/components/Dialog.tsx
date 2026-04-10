import * as React from "react";
import { Box } from "./Box";

export type DialogProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Dialog({ open, title, onClose, children }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="tui-dialog-backdrop" onClick={onClose}>
      <div className="tui-dialog" onClick={(e) => e.stopPropagation()}>
        <Box title={title} double>
          {children}
        </Box>
      </div>
    </div>
  );
}

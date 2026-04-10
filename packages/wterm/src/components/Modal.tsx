import * as React from "react";
import { Box } from "./Box";
import { useFocusable } from "../nav/useFocusable";

export type ModalProps = {
  open: boolean;
  title?: string;
  message: React.ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, message, onClose }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const okProps = useFocusable({ label: title ? `${title}: OK` : "OK", onSelect: onClose, group: "Modal" });

  if (!open) return null;
  return (
    <div className="tui-dialog-backdrop" onClick={onClose}>
      <div className="tui-dialog" onClick={(e) => e.stopPropagation()}>
        <Box title={title} double>
          <div style={{ padding: "var(--tui-pad-y) 0" }}>{message}</div>
          <div style={{ marginTop: "0.5rem", textAlign: "right" }}>
            <span {...okProps} className={`${okProps.className} tui-button`}>
              OK
            </span>
          </div>
        </Box>
      </div>
    </div>
  );
}

export type UseModalReturn = {
  open: (message: React.ReactNode, title?: string) => void;
  close: () => void;
  props: ModalProps;
};

export function useModal(): UseModalReturn {
  const [state, setState] = React.useState<{
    open: boolean;
    message: React.ReactNode;
    title?: string;
  }>({ open: false, message: "" });

  const open = React.useCallback((message: React.ReactNode, title?: string) => {
    setState({ open: true, message, title });
  }, []);

  const close = React.useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  return {
    open,
    close,
    props: {
      open: state.open,
      message: state.message,
      title: state.title,
      onClose: close,
    },
  };
}

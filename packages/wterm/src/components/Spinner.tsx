import * as React from "react";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function Spinner({ label }: { label?: string }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % FRAMES.length), 80);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tui-spinner">
      {FRAMES[i]} {label}
    </span>
  );
}

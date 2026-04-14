# wterm

TUI components for React. Monospace, box-drawing, keyboard-first — with mouse support.

[Docs & demos](https://wterm.droak.sh)

## Install

```sh
pnpm add @droak/wterm react react-dom cmdk
```

## Quick start

```tsx
import "@droak/wterm/styles.css";
import { NavProvider, Button } from "@droak/wterm";

export function App() {
  return (
    <NavProvider>
      <Button label="Save" onSelect={() => console.log("saved")} />
    </NavProvider>
  );
}
```

Press **Cmd+K** to open the command palette — every interactive component is registered automatically.

## Components

Box, Button, Input, Checkbox, Radio, Select, List, Menu, Tabs, Dialog, Modal, ProgressBar, Spinner, Table, StatusBar.

## Themes

Set `data-theme` on any container to switch. Ships with:

- **catppuccin** (default) — Catppuccin Macchiato
- **solarized** — Solarized Dark
- **gruvbox** — Gruvbox Dark
- **dracula** — Dracula

```html
<div class="tui" data-theme="dracula">...</div>
```

All theme colors are exposed as CSS variables (`--tui-red`, `--tui-green`, `--tui-blue`, etc.).

## Dev

```sh
pnpm install
pnpm dev          # docs site at localhost:5173
pnpm build        # build library
pnpm test         # run tests
```

## License

MIT

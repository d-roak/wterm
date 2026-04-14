# wterm — TUI Components for React

## What this is
A React component library that replicates classic terminal UI (TUI) components.
Components are **navigable by keyboard via cmdk** (command palette + arrow keys)
and **fully clickable** with the mouse. Same handler runs for both paths.

## Core principles
1. **Minimal dependencies.** Runtime deps: `react` (peer), `cmdk`. Nothing else.
2. **Plain CSS, themable via CSS variables.** No CSS-in-JS, no Tailwind, no icon libs.
3. **One nav primitive.** `useFocusable({ id, label, onSelect })` registers an
   element with the cmdk command list and binds `onClick` + `onKeyDown(Enter/Space)`
   to the same `onSelect`. Keyboard and mouse paths are identical.
4. **Tree-shakeable named exports** from `@droak/wterm`.
5. **Look:** monospace font, box-drawing characters (`┌─┐│└┘`), single/double borders.

## Repo layout
```
webtui/
├── claude.md                    # this file
├── package.json                 # pnpm workspace root
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── packages/
│   └── wterm/                   # the library
│       ├── src/
│       │   ├── index.ts
│       │   ├── styles/tui.css
│       │   ├── nav/             # NavProvider, useFocusable, CommandPalette
│       │   └── components/      # Box, Button, Input, ...
│       └── vite.config.ts       # library build (ESM + d.ts)
└── docs/                        # Vite SPA showcasing every component
    └── src/
```

## Components (v0)
Box, Button, Input, Checkbox, Radio, Select, List, Menu, Tabs, Dialog,
ProgressBar, Spinner, Table, StatusBar, CodeBlock.

Every interactive component uses `useFocusable` so it appears in the palette
(⌘K) and responds to clicks identically.

## Theming
All colors / spacing / borders are CSS custom properties on `:root` (and
overridable on any subtree via `[data-theme]`).

Built-in themes (set via `data-theme` attribute):
- **catppuccin** (default) — Catppuccin Macchiato, warm dark
- **solarized** — Solarized Dark
- **gruvbox** — Gruvbox Dark, warm earthy tones
- **dracula** — Dracula, vivid high-saturation accents

Every theme exposes the full Catppuccin-style named palette as CSS vars:
`--tui-rosewater`, `--tui-flamingo`, `--tui-pink`, `--tui-mauve`, `--tui-red`,
`--tui-maroon`, `--tui-peach`, `--tui-yellow`, `--tui-green`, `--tui-teal`,
`--tui-sky`, `--tui-sapphire`, `--tui-blue`, `--tui-lavender`,
`--tui-text`, `--tui-subtext1`, `--tui-subtext0`,
`--tui-overlay2`, `--tui-overlay1`, `--tui-overlay0`,
`--tui-surface2`, `--tui-surface1`, `--tui-surface0`,
`--tui-base`, `--tui-mantle`, `--tui-crust`.

Semantic aliases: `--tui-bg`, `--tui-fg`, `--tui-accent`, `--tui-muted`,
`--tui-border`, `--tui-selection`. Layout: `--tui-font`, `--tui-radius`,
`--tui-pad-x`, `--tui-pad-y`.

## Dev workflow
- `pnpm install` — install
- `pnpm dev` — run docs site (Vite, hot reload, imports lib via workspace)
- `pnpm build` — build the library (`packages/wterm/dist`)
- `pnpm docs:build` — build static docs site

## Constraints / non-goals
- No additional runtime deps without a very good reason.
- No emoji, no icon libs (use box-drawing / ASCII).
- No animation libs; CSS transitions only where they reinforce the TUI feel.
- No SSR-only features; library must work in plain Vite SPA.

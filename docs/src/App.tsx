import * as React from "react";
import {
  NavProvider,
  Box, Button, Input, Checkbox, Radio, Select, List, Menu,
  Tabs, Dialog, Modal, useModal, ProgressBar, Spinner, Table, StatusBar,
} from "@droak/wterm";

type ComponentSection = {
  id: string;
  name: string;
  description: string;
  usage: string;
  render: () => React.ReactNode;
};

type ProsePage = {
  id: string;
  name: string;
  body: React.ReactNode;
};

type SidebarGroup = {
  title: string;
  items: { id: string; name: string }[];
};

function useHashRoute(fallback: string) {
  const read = () => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return h || fallback;
  };
  const [id, setId] = React.useState(read);
  React.useEffect(() => {
    const onHash = () => {
      setId(read());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return id;
}

function useDemoState() {
  const [text, setText] = React.useState("hello");
  const [checked, setChecked] = React.useState(true);
  const [radio, setRadio] = React.useState<"a" | "b" | "c">("a");
  const [sel, setSel] = React.useState("md");
  const [listSel, setListSel] = React.useState("two");
  const [tab, setTab] = React.useState("overview");
  const [dialog, setDialog] = React.useState(false);
  const [progress, setProgress] = React.useState(0.4);
  return { text, setText, checked, setChecked, radio, setRadio, sel, setSel, listSel, setListSel, tab, setTab, dialog, setDialog, progress, setProgress };
}

function ShowcaseCard({ preview, code }: { preview: React.ReactNode; code: string }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  return (
    <div className="docs-showcase-card">
      <div className="docs-showcase-tabs">
        <button
          className={`docs-showcase-tab ${tab === "preview" ? "active" : ""}`}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
        <button
          className={`docs-showcase-tab ${tab === "code" ? "active" : ""}`}
          onClick={() => setTab("code")}
        >
          Code
        </button>
      </div>
      {tab === "preview" ? (
        <div className="docs-showcase">{preview}</div>
      ) : (
        <div className="docs-code-panel">
          <CodeBlock code={code} />
        </div>
      )}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="docs-code">
      <code dangerouslySetInnerHTML={{ __html: highlightJsx(code) }} />
    </pre>
  );
}

const KW = new Set([
  "import","from","export","const","let","var","function","return",
  "default","if","else","new","typeof","type","interface",
]);
const LIT = new Set(["true","false","null","undefined"]);

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function span(cls: string, text: string) {
  return `<span class="${cls}">${esc(text)}</span>`;
}

function highlightJsx(src: string): string {
  // Tokenize with a single pass regex — order of alternations matters.
  const re =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Z]\w*|<\/?[a-z]\w*)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_$]\w*\b)|(\/?>)|([{}()[\],;:.])|(\n)|(.)/g;

  let out = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const [
      full,
      comment,
      str,
      tag,
      num,
      word,
      closeTag,
      punc,
      nl,
      _,
    ] = m;
    if (comment) {
      out += span("hl-cmt", comment);
    } else if (str) {
      out += span("hl-str", str);
    } else if (tag) {
      // split into angle-bracket part and name
      const bracket = tag.match(/^(<\/?)(.+)$/)!;
      const isComponent = /^[A-Z]/.test(bracket[2]);
      out += esc(bracket[1]) + span(isComponent ? "hl-tag" : "hl-html", bracket[2]);
    } else if (num) {
      out += span("hl-num", num);
    } else if (word) {
      if (KW.has(word)) {
        out += span("hl-kw", word);
      } else if (LIT.has(word)) {
        out += span("hl-num", word);
      } else {
        // Check if next non-space char is '=' (JSX prop) or '(' (function call)
        const rest = src.slice(re.lastIndex);
        if (/^\s*=(?!=)/.test(rest)) {
          out += span("hl-prop", word);
        } else if (/^\s*\(/.test(rest)) {
          out += span("hl-fn", word);
        } else {
          out += esc(word);
        }
      }
    } else if (closeTag) {
      out += span("hl-punc", closeTag);
    } else if (punc) {
      out += span("hl-punc", punc);
    } else if (nl) {
      out += "\n";
    } else {
      out += esc(full);
    }
  }
  return out;
}

function ThemePalette({ colors }: { colors: { name: string; hex: string }[] }) {
  return (
    <div className="docs-palette">
      {colors.map((c) => (
        <div key={c.name} className="docs-swatch-row">
          <span className="docs-swatch" style={{ background: c.hex }} />
          <code>{c.hex}</code>
          <span className="docs-hint">{c.name}</span>
        </div>
      ))}
    </div>
  );
}

function TerminalPreview({ themeId }: { themeId: string }) {
  return (
    <div className="tui docs-terminal" data-theme={themeId}>
      <div className="docs-terminal-titlebar">
        <span style={{ color: "var(--tui-red)" }}>*</span>{" "}
        <span style={{ color: "var(--tui-yellow)" }}>*</span>{" "}
        <span style={{ color: "var(--tui-green)" }}>*</span>
        <span className="docs-terminal-title">{themeId}</span>
      </div>
      <div className="docs-terminal-body">
        <div>
          <span style={{ color: "var(--tui-green)" }}>user</span>
          <span style={{ color: "var(--tui-muted)" }}>@</span>
          <span style={{ color: "var(--tui-blue)" }}>wterm</span>
          <span style={{ color: "var(--tui-muted)" }}> ~ $</span>
          <span style={{ color: "var(--tui-fg)" }}> ls -la</span>
        </div>
        <div style={{ color: "var(--tui-muted)" }}>drwxr-xr-x  5 user staff  160 Apr 10 09:00 <span style={{ color: "var(--tui-blue)" }}>.</span></div>
        <div style={{ color: "var(--tui-muted)" }}>-rw-r--r--  1 user staff  842 Apr 10 08:45 <span style={{ color: "var(--tui-fg)" }}>README.md</span></div>
        <div style={{ color: "var(--tui-muted)" }}>-rw-r--r--  1 user staff 1204 Apr 10 08:50 <span style={{ color: "var(--tui-yellow)" }}>config.json</span></div>
        <div style={{ color: "var(--tui-muted)" }}>-rwxr-xr-x  1 user staff 2048 Apr 10 09:00 <span style={{ color: "var(--tui-green)" }}>deploy.sh</span></div>
        <div style={{ marginTop: "0.25rem" }}>
          <span style={{ color: "var(--tui-green)" }}>user</span>
          <span style={{ color: "var(--tui-muted)" }}>@</span>
          <span style={{ color: "var(--tui-blue)" }}>wterm</span>
          <span style={{ color: "var(--tui-muted)" }}> ~ $</span>
          <span style={{ color: "var(--tui-fg)" }}> cat config.json</span>
        </div>
        <div>
          <span style={{ color: "var(--tui-muted)" }}>{"{"}</span>
        </div>
        <div>
          {"  "}<span style={{ color: "var(--tui-mauve)" }}>"name"</span>
          <span style={{ color: "var(--tui-muted)" }}>: </span>
          <span style={{ color: "var(--tui-green)" }}>"wterm"</span>
          <span style={{ color: "var(--tui-muted)" }}>,</span>
        </div>
        <div>
          {"  "}<span style={{ color: "var(--tui-mauve)" }}>"theme"</span>
          <span style={{ color: "var(--tui-muted)" }}>: </span>
          <span style={{ color: "var(--tui-green)" }}>"{themeId}"</span>
          <span style={{ color: "var(--tui-muted)" }}>,</span>
        </div>
        <div>
          {"  "}<span style={{ color: "var(--tui-mauve)" }}>"port"</span>
          <span style={{ color: "var(--tui-muted)" }}>: </span>
          <span style={{ color: "var(--tui-peach)" }}>3000</span>
          <span style={{ color: "var(--tui-muted)" }}>,</span>
        </div>
        <div>
          {"  "}<span style={{ color: "var(--tui-mauve)" }}>"debug"</span>
          <span style={{ color: "var(--tui-muted)" }}>: </span>
          <span style={{ color: "var(--tui-peach)" }}>true</span>
        </div>
        <div>
          <span style={{ color: "var(--tui-muted)" }}>{"}"}</span>
        </div>
        <div style={{ marginTop: "0.25rem" }}>
          <span style={{ color: "var(--tui-green)" }}>user</span>
          <span style={{ color: "var(--tui-muted)" }}>@</span>
          <span style={{ color: "var(--tui-blue)" }}>wterm</span>
          <span style={{ color: "var(--tui-muted)" }}> ~ $</span>
          <span style={{ color: "var(--tui-fg)" }}> ./deploy.sh</span>
        </div>
        <div>
          <span style={{ color: "var(--tui-yellow)" }}>WARN</span>
          <span style={{ color: "var(--tui-fg)" }}> compiling assets...</span>
        </div>
        <div>
          <span style={{ color: "var(--tui-red)" }}>ERR!</span>
          <span style={{ color: "var(--tui-fg)" }}> missing dependency </span>
          <span style={{ color: "var(--tui-pink)" }}>@droak/wterm</span>
        </div>
        <div>
          <span style={{ color: "var(--tui-teal)" }}>INFO</span>
          <span style={{ color: "var(--tui-fg)" }}> installing...</span>
        </div>
        <div>
          <span style={{ color: "var(--tui-green)" }}>OK</span>
          <span style={{ color: "var(--tui-fg)" }}> deployed to </span>
          <span style={{ color: "var(--tui-sapphire)", textDecoration: "underline" }}>https://wterm.droak.sh</span>
        </div>
        <div className="docs-terminal-statusbar">
          <span>main</span>
          <span style={{ color: "var(--tui-accent)" }}>NORMAL</span>
          <span>utf-8</span>
          <span style={{ color: "var(--tui-muted)" }}>Ln 42, Col 1</span>
        </div>
      </div>
    </div>
  );
}

const THEMES = [
  { id: "catppuccin", label: "Catppuccin" },
  { id: "solarized", label: "Solarized" },
  { id: "gruvbox", label: "Gruvbox" },
  { id: "dracula", label: "Dracula" },
] as const;

export function App() {
  const s = useDemoState();
  const activeId = useHashRoute("introduction");
  const [previewTheme, setPreviewTheme] = React.useState("catppuccin");
  const modal = useModal();

  const overview: ProsePage[] = [
    {
      id: "introduction",
      name: "Introduction",
      body: (
        <>
          <p>
            <strong>wterm</strong> is a tiny React component library that
            replicates the look and feel of classic terminal UIs. It ships with
            fifteen basic components, a single navigation primitive, and almost
            nothing else — its only runtime dependency besides React is{" "}
            <code>cmdk</code>.
          </p>
          <p>
            Every interactive component is simultaneously <em>clickable</em> and{" "}
            <em>keyboard-navigable via a command palette</em>. The same handler
            fires for mouse clicks, Enter, Space, and palette selection — you
            never have to wire up two code paths.
          </p>
          <p>Design tenets:</p>
          <ul>
            <li>Minimal dependencies (React peer + cmdk, nothing else).</li>
            <li>Plain CSS, fully themable through CSS variables.</li>
            <li>One nav primitive — <code>useFocusable</code> — for everything.</li>
            <li>Monospace + box-drawing characters for the authentic TUI feel.</li>
          </ul>
        </>
      ),
    },
    {
      id: "getting-started",
      name: "Getting Started",
      body: (
        <>
          <p>Install the package and its peer dependencies:</p>
          <pre className="docs-code">{`pnpm add @droak/wterm react react-dom cmdk`}</pre>
          <p>Import the stylesheet once at the root of your app:</p>
          <pre className="docs-code">{`import "@droak/wterm/styles.css";`}</pre>
          <p>
            Wrap your tree in <code>NavProvider</code> so the command palette
            (⌘K) and focus registry work:
          </p>
          <pre className="docs-code">{`import { NavProvider, Button } from "@droak/wterm";

export function App() {
  return (
    <NavProvider>
      <Button label="Save" onSelect={() => console.log("saved")} />
    </NavProvider>
  );
}`}</pre>
          <p>
            Press <strong>⌘K</strong> (or <strong>Ctrl+K</strong>) anywhere in
            your app to search and run any registered action.
          </p>
        </>
      ),
    },
  ];

  const customization: ProsePage[] = [
    {
      id: "styling",
      name: "Styling",
      body: (
        <>
          <p>
            All styles live in <code>@droak/wterm/styles.css</code> and are driven
            by CSS custom properties. Override them on <code>:root</code> or scope
            to any subtree using the <code>data-theme</code> attribute:
          </p>
          <pre className="docs-code">{`/* Override semantic vars globally */
:root {
  --tui-bg:        var(--tui-base);
  --tui-fg:        var(--tui-text);
  --tui-accent:    var(--tui-peach);
  --tui-muted:     var(--tui-overlay1);
  --tui-border:    var(--tui-surface1);
  --tui-selection: var(--tui-surface0);
}

/* Or switch theme on any subtree */
<div data-theme="dracula">
  <Box>This region uses Dracula</Box>
</div>`}</pre>
          <h4>Available variables</h4>
          <Table
            columns={[
              { key: "variable", header: "Variable" },
              { key: "role", header: "Role" },
            ]}
            rows={[
              { variable: "--tui-bg", role: "Background" },
              { variable: "--tui-fg", role: "Foreground / text" },
              { variable: "--tui-accent", role: "Accents, focus, headings" },
              { variable: "--tui-muted", role: "Disabled, hints, dimmed text" },
              { variable: "--tui-border", role: "Borders, dividers" },
              { variable: "--tui-selection", role: "Selection, highlighted rows" },
              { variable: "--tui-mantle", role: "Status bar, secondary surfaces" },
              { variable: "--tui-font", role: "Font stack (monospace)" },
              { variable: "--tui-radius", role: "Border radius (0 for TUI feel)" },
              { variable: "--tui-pad-x", role: "Horizontal padding" },
              { variable: "--tui-pad-y", role: "Vertical padding" },
            ]}
          />
        </>
      ),
    },
    {
      id: "themes",
      name: "Themes",
      body: (
        <>
          <p>
            wterm ships four built-in themes. Set <code>data-theme</code> on
            any container (typically the root <code>.tui</code> div) to switch.
            The default is <strong>Catppuccin</strong> (Macchiato).
          </p>
          <pre className="docs-code">{`<div className="tui" data-theme="dracula">
  ...
</div>`}</pre>
          <p>Select a theme to preview it in the simulated terminal below:</p>
          <div style={{ display: "flex", gap: "1ch", flexWrap: "wrap", margin: "0.5rem 0 1.5rem" }}>
            {THEMES.map((t) => (
              <Button
                key={t.id}
                label={t.label}
                group="Themes"
                onSelect={() => setPreviewTheme(t.id)}
              />
            ))}
          </div>

          <TerminalPreview themeId={previewTheme} />

          <h4>Side by side</h4>
          <p className="docs-hint">All four themes at a glance:</p>
          <div className="docs-theme-grid">
            {THEMES.map((t) => (
              <TerminalPreview key={t.id} themeId={t.id} />
            ))}
          </div>

          <h4>Catppuccin (Macchiato) palette</h4>
          <p className="docs-hint">Default. All named colors are available as <code>--tui-*</code> CSS variables.</p>
          <div className="docs-palette-grid">
            <ThemePalette
              colors={[
                { name: "rosewater", hex: "#f4dbd6" },
                { name: "flamingo",  hex: "#f0c6c6" },
                { name: "pink",      hex: "#f5bde6" },
                { name: "mauve",     hex: "#c6a0f6" },
                { name: "red",       hex: "#ed8796" },
                { name: "maroon",    hex: "#ee99a0" },
                { name: "peach",     hex: "#f5a97f" },
                { name: "yellow",    hex: "#eed49f" },
                { name: "green",     hex: "#a6da95" },
                { name: "teal",      hex: "#8bd5ca" },
                { name: "sky",       hex: "#91d7e3" },
                { name: "sapphire",  hex: "#7dc4e4" },
                { name: "blue",      hex: "#8aadf4" },
                { name: "lavender",  hex: "#b7bdf8" },
              ]}
            />
            <ThemePalette
              colors={[
                { name: "text",      hex: "#cad3f5" },
                { name: "subtext1",  hex: "#b8c0e0" },
                { name: "subtext0",  hex: "#a5adcb" },
                { name: "overlay2",  hex: "#939ab7" },
                { name: "overlay1",  hex: "#8087a2" },
                { name: "overlay0",  hex: "#6e738d" },
                { name: "surface2",  hex: "#5b6078" },
                { name: "surface1",  hex: "#494d64" },
                { name: "surface0",  hex: "#363a4f" },
                { name: "base",      hex: "#24273a" },
                { name: "mantle",    hex: "#1e2030" },
                { name: "crust",     hex: "#181926" },
              ]}
            />
          </div>

          <h4>All palette variables</h4>
          <p>
            Every theme exposes the same set of CSS variables. Use the named
            colors (<code>--tui-red</code>, <code>--tui-green</code>, etc.)
            directly in your own components for consistent theming:
          </p>
          <pre className="docs-code">{`.my-error  { color: var(--tui-red); }
.my-ok     { color: var(--tui-green); }
.my-warn   { color: var(--tui-yellow); }
.my-link   { color: var(--tui-blue); }
.my-subtle { color: var(--tui-overlay1); }`}</pre>
        </>
      ),
    },
    {
      id: "animation",
      name: "Animation",
      body: (
        <>
          <p>
            The library ships zero animation code. TUI aesthetics favor discrete
            state changes over easing, so the defaults are static. When you
            <em> do</em> want motion, layer it on with plain CSS transitions
            targeting the library's classes:
          </p>
          <pre className="docs-code">{`.tui-focusable { transition: background 80ms steps(2); }
.tui-dialog-backdrop { animation: flicker 120ms steps(2) both; }

@keyframes flicker {
  0%   { opacity: 0; }
  50%  { opacity: 0.4; }
  100% { opacity: 1; }
}`}</pre>
          <p>
            The built-in <code>Spinner</code> is the only component that
            animates, using a braille frame cycle driven by{" "}
            <code>setInterval</code>. It needs no CSS.
          </p>
        </>
      ),
    },
    {
      id: "composition",
      name: "Composition",
      body: (
        <>
          <p>
            Components are designed to compose. <code>Menu</code>, for example,
            is nothing more than a <code>Box</code> wrapping a <code>List</code>{" "}
            — you can build the same thing yourself and get identical behavior.
          </p>
          <pre className="docs-code">{`<Box title="File" double>
  <List
    items={items}
    group="File"
    onSelect={(id) => actions[id]()}
  />
</Box>`}</pre>
          <p>
            Building your own interactive primitive? Use{" "}
            <code>useFocusable</code> directly. It returns props you spread onto
            any element. The element is automatically registered with the
            palette and handles click + Enter/Space.
          </p>
          <pre className="docs-code">{`import { useFocusable } from "@droak/wterm";

function Tile({ label, onOpen }) {
  const f = useFocusable({ label, onSelect: onOpen, group: "Tiles" });
  return <div {...f} className={\`\${f.className} my-tile\`}>{label}</div>;
}`}</pre>
        </>
      ),
    },
    {
      id: "ssr",
      name: "Server-side Rendering",
      body: (
        <>
          <p>
            The components are plain function components with no side effects at
            import time — they render fine on the server. A few notes:
          </p>
          <ul>
            <li>
              <code>NavProvider</code> mounts a <code>keydown</code> listener on{" "}
              <code>window</code>. Its effects run client-only, so SSR output is
              stable; the palette hydrates on the client.
            </li>
            <li>
              <code>Spinner</code> uses <code>setInterval</code> inside{" "}
              <code>useEffect</code>, so the initial server frame renders the
              first glyph and the client takes over.
            </li>
            <li>
              Import the stylesheet through your framework's global CSS mechanism
              (e.g. a root <code>layout.tsx</code> in Next.js) to avoid a flash
              of unstyled content.
            </li>
          </ul>
          <p>
            Next.js example:
          </p>
          <pre className="docs-code">{`// app/layout.tsx
import "@droak/wterm/styles.css";
import { NavProvider } from "@droak/wterm";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NavProvider>{children}</NavProvider>
      </body>
    </html>
  );
}`}</pre>
        </>
      ),
    },
  ];

  const sections: ComponentSection[] = [
    {
      id: "box",
      name: "Box",
      description: "Bordered container with optional title and double-border variant. The atomic building block — every other surface is composed inside one.",
      usage: `import { Box } from "@droak/wterm";

function Settings() {
  return (
    <Box title="Settings" double>
      ...children
    </Box>
  );
}`,
      render: () => (
        <>
          <Box title="Single">single border box</Box>
          <div style={{ height: 12 }} />
          <Box title="Double" double>double border box</Box>
        </>
      ),
    },
    {
      id: "button",
      name: "Button",
      description: "Clickable, focusable action. Registered with the command palette so ⌘K + label invokes it. Same handler runs for click and Enter/Space.",
      usage: `import { Button } from "@droak/wterm";

function SaveButton() {
  return <Button label="Save" onSelect={() => save()} />;
}`,
      render: () => <Button label="Click me" onSelect={() => modal.open("Button was clicked!", "Click")} />,
    },
    {
      id: "input",
      name: "Input",
      description: "Single-line text input. Controlled.",
      usage: `import { Input } from "@droak/wterm";
import { useState } from "react";

function NameField() {
  const [name, setName] = useState("");
  return <Input label="Name" value={name} onChange={setName} />;
}`,
      render: () => <Input label="Name" value={s.text} onChange={s.setText} />,
    },
    {
      id: "checkbox",
      name: "Checkbox",
      description: "Boolean toggle, focusable, palette-registered.",
      usage: `import { Checkbox } from "@droak/wterm";
import { useState } from "react";

function WrapToggle() {
  const [wrap, setWrap] = useState(false);
  return <Checkbox label="Wrap lines" checked={wrap} onChange={setWrap} />;
}`,
      render: () => <Checkbox label="Wrap lines" checked={s.checked} onChange={s.setChecked} />,
    },
    {
      id: "radio",
      name: "Radio",
      description: "Single-choice radio group. Each option is independently focusable and palette-registered.",
      usage: `import { Radio } from "@droak/wterm";
import { useState } from "react";

function SizePicker() {
  const [size, setSize] = useState("a");
  return (
    <Radio
      name="size"
      value={size}
      options={[
        { value: "a", label: "Small" },
        { value: "b", label: "Medium" },
        { value: "c", label: "Large" },
      ]}
      onChange={setSize}
    />
  );
}`,
      render: () => (
        <Radio
          name="size"
          value={s.radio}
          options={[
            { value: "a", label: "Small" },
            { value: "b", label: "Medium" },
            { value: "c", label: "Large" },
          ]}
          onChange={s.setRadio}
        />
      ),
    },
    {
      id: "select",
      name: "Select",
      description: "Dropdown selector. Toggling reveals a List of options.",
      usage: `import { Select } from "@droak/wterm";
import { useState } from "react";

function ModePicker() {
  const [mode, setMode] = useState("md");
  return (
    <Select
      label="Mode"
      value={mode}
      options={[
        { value: "md", label: "Markdown" },
        { value: "ts", label: "TypeScript" },
        { value: "json", label: "JSON" },
      ]}
      onChange={setMode}
    />
  );
}`,
      render: () => (
        <Select
          label="Mode"
          value={s.sel}
          options={[
            { value: "md", label: "Markdown" },
            { value: "ts", label: "TypeScript" },
            { value: "json", label: "JSON" },
          ]}
          onChange={s.setSel}
        />
      ),
    },
    {
      id: "list",
      name: "List",
      description: "Vertical selectable list. Each row is focusable; selected row gets `>` cursor.",
      usage: `import { Box, List } from "@droak/wterm";
import { useState } from "react";

function FileList() {
  const [sel, setSel] = useState("two");
  return (
    <Box>
      <List
        items={[
          { id: "one", label: "One" },
          { id: "two", label: "Two" },
          { id: "three", label: "Three" },
        ]}
        selectedId={sel}
        onSelect={setSel}
      />
    </Box>
  );
}`,
      render: () => (
        <Box>
          <List
            items={[
              { id: "one", label: "One" },
              { id: "two", label: "Two" },
              { id: "three", label: "Three" },
            ]}
            selectedId={s.listSel}
            onSelect={s.setListSel}
            group="Demo list"
          />
        </Box>
      ),
    },
    {
      id: "menu",
      name: "Menu",
      description: "A titled Box wrapping a List of action items, each with its own onSelect.",
      usage: `import { Menu } from "@droak/wterm";

function FileMenu() {
  return (
    <Menu
      title="File"
      items={[
        { id: "n", label: "New", onSelect: () => newFile() },
        { id: "o", label: "Open", onSelect: () => openFile() },
        { id: "s", label: "Save", onSelect: () => saveFile() },
      ]}
    />
  );
}`,
      render: () => (
        <Menu
          title="File"
          items={[
            { id: "n", label: "New", onSelect: () => modal.open("New file created.", "File") },
            { id: "o", label: "Open", onSelect: () => modal.open("File opened.", "File") },
            { id: "s", label: "Save", onSelect: () => modal.open("File saved.", "File") },
          ]}
        />
      ),
    },
    {
      id: "tabs",
      name: "Tabs",
      description: "Tab strip with content panel. Tab heads are focusable and registered in the palette.",
      usage: `import { Tabs } from "@droak/wterm";
import { useState } from "react";

function InfoTabs() {
  const [tab, setTab] = useState("overview");
  return (
    <Tabs
      activeId={tab}
      onChange={setTab}
      tabs={[
        { id: "overview", label: "Overview", content: <p>Overview.</p> },
        { id: "details", label: "Details", content: <p>Details.</p> },
        { id: "logs", label: "Logs", content: <p>Logs.</p> },
      ]}
    />
  );
}`,
      render: () => (
        <Tabs
          activeId={s.tab}
          onChange={s.setTab}
          tabs={[
            { id: "overview", label: "Overview", content: <p>Overview content.</p> },
            { id: "details", label: "Details", content: <p>Details content.</p> },
            { id: "logs", label: "Logs", content: <p>Logs content.</p> },
          ]}
        />
      ),
    },
    {
      id: "dialog",
      name: "Dialog",
      description: "Modal overlay rendered in a double-border Box. Closes on Escape or backdrop click.",
      usage: `import { Dialog, Button } from "@droak/wterm";
import { useState } from "react";

function ConfirmDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button label="Open dialog" onSelect={() => setOpen(true)} />
      <Dialog open={open} title="Confirm" onClose={() => setOpen(false)}>
        <p>Are you sure?</p>
        <Button label="Cancel" onSelect={() => setOpen(false)} />
        <Button label="Confirm" onSelect={() => setOpen(false)} />
      </Dialog>
    </>
  );
}`,
      render: () => (
        <>
          <Button label="Open dialog" onSelect={() => s.setDialog(true)} />
          <Dialog open={s.dialog} title="Confirm" onClose={() => s.setDialog(false)}>
            <p>Are you sure?</p>
            <Button label="Cancel" onSelect={() => s.setDialog(false)} />{" "}
            <Button label="Confirm" onSelect={() => s.setDialog(false)} />
          </Dialog>
        </>
      ),
    },
    {
      id: "modal",
      name: "Modal",
      description: "Imperative alert replacement. Uses useModal() to get an open(message, title?) function and spread the returned props onto <Modal>. Closes on Escape, backdrop click, or the OK button.",
      usage: `import { Modal, useModal, Button } from "@droak/wterm";

function App() {
  const modal = useModal();
  return (
    <>
      <Button
        label="Show alert"
        onSelect={() => modal.open("Something happened!", "Info")}
      />
      <Modal {...modal.props} />
    </>
  );
}`,
      render: () => (
        <Button label="Show modal" onSelect={() => modal.open("This is a wterm modal — no browser alert!", "Modal")} />
      ),
    },
    {
      id: "progress",
      name: "ProgressBar",
      description: "ASCII progress bar (`█░`). Width is in characters.",
      usage: `import { ProgressBar } from "@droak/wterm";

function Upload() {
  return <ProgressBar value={0.4} width={20} />;
}`,
      render: () => (
        <>
          <ProgressBar value={s.progress} width={30} />
          <div style={{ height: 8 }} />
          <Button label="+ 10%" onSelect={() => s.setProgress((p) => Math.min(1, p + 0.1))} />{" "}
          <Button label="− 10%" onSelect={() => s.setProgress((p) => Math.max(0, p - 0.1))} />
        </>
      ),
    },
    {
      id: "spinner",
      name: "Spinner",
      description: "Braille spinner with optional label.",
      usage: `import { Spinner } from "@droak/wterm";

function Loading() {
  return <Spinner label="Loading..." />;
}`,
      render: () => <Spinner label="Loading..." />,
    },
    {
      id: "table",
      name: "Table",
      description: "Bordered data table. Generic over row type.",
      usage: `import { Table } from "@droak/wterm";

function UserTable() {
  return (
    <Table
      columns={[
        { key: "name", header: "Name" },
        { key: "role", header: "Role" },
        { key: "since", header: "Since" },
      ]}
      rows={[
        { name: "ada", role: "admin", since: "2021" },
        { name: "linus", role: "user", since: "2022" },
        { name: "grace", role: "user", since: "2023" },
      ]}
    />
  );
}`,
      render: () => (
        <Table
          columns={[
            { key: "name", header: "Name" },
            { key: "role", header: "Role" },
            { key: "since", header: "Since" },
          ]}
          rows={[
            { name: "ada", role: "admin", since: "2021" },
            { name: "linus", role: "user",  since: "2022" },
            { name: "grace", role: "user",  since: "2023" },
          ]}
        />
      ),
    },
    {
      id: "statusbar",
      name: "StatusBar",
      description: "Bottom status strip with arbitrary item slots.",
      usage: `import { StatusBar } from "@droak/wterm";

function EditorStatus() {
  return <StatusBar items={["main", "INSERT", "UTF-8", "Ln 12, Col 4"]} />;
}`,
      render: () => <StatusBar items={["main", "INSERT", "UTF-8", "Ln 12, Col 4"]} />,
    },
  ];

  const groups: (SidebarGroup & { kind: "prose" | "component" })[] = [
    { title: "Overview",      kind: "prose",     items: overview.map((p) => ({ id: p.id, name: p.name })) },
    { title: "Customization", kind: "prose",     items: customization.map((p) => ({ id: p.id, name: p.name })) },
    { title: "Components",    kind: "component", items: sections.map((se) => ({ id: se.id, name: se.name })) },
  ];

  const prosePages: Record<string, ProsePage> = Object.fromEntries(
    [...overview, ...customization].map((p) => [p.id, p])
  );
  const componentPages: Record<string, ComponentSection> = Object.fromEntries(
    sections.map((se) => [se.id, se])
  );

  const activeProse = prosePages[activeId];
  const activeComponent = componentPages[activeId];
  const activeGroup = groups.find((g) => g.items.some((it) => it.id === activeId));

  return (
    <NavProvider>
      <div className="docs-shell tui">
        <aside className="docs-side">
          <h1>
            <a href="#/introduction" style={{ color: "var(--tui-accent)", textDecoration: "none" }}>
              wterm
            </a>
          </h1>
          <p className="docs-hint">Press <strong>⌘K</strong> to open the command palette.</p>
          <nav>
            {groups.map((g) => (
              <div key={g.title} className="docs-nav-group">
                <div className="docs-nav-heading">{g.title}</div>
                {g.items.map((it) => (
                  <a
                    key={it.id}
                    href={`#/${it.id}`}
                    aria-current={it.id === activeId ? "page" : undefined}
                  >
                    {it.name}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </aside>
        <main className="docs-main">
          {activeGroup && <div className="docs-breadcrumb">{activeGroup.title}</div>}

          {activeProse && (
            <article className="docs-section">
              <h2>{activeProse.name}</h2>
              {activeProse.body}
            </article>
          )}

          {activeComponent && (
            <article className="docs-section">
              <h2>{activeComponent.name}</h2>
              <p>{activeComponent.description}</p>
              <ShowcaseCard
                preview={activeComponent.render()}
                code={activeComponent.usage}
              />
            </article>
          )}

          {!activeProse && !activeComponent && (
            <article className="docs-section">
              <h2>Not found</h2>
              <p>
                No page matches <code>{activeId}</code>.{" "}
                <a href="#/introduction">Back to Introduction</a>.
              </p>
            </article>
          )}
        </main>
        <Modal {...modal.props} />
      </div>
    </NavProvider>
  );
}

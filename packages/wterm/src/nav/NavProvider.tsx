import * as React from "react";
import { Command } from "cmdk";

export type FocusableEntry = {
  id: string;
  label: string;
  onSelect: () => void;
  group?: string;
};

type NavCtx = {
  register: (e: FocusableEntry) => () => void;
  entries: () => FocusableEntry[];
  openPalette: () => void;
  closePalette: () => void;
};

const Ctx = React.createContext<NavCtx | null>(null);

export function useNav() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useNav must be used inside <NavProvider>");
  return c;
}

export function NavProvider({ children }: { children: React.ReactNode }) {
  const entriesRef = React.useRef<Map<string, FocusableEntry>>(new Map());
  const [, force] = React.useReducer((x) => x + 1, 0);
  const [open, setOpen] = React.useState(false);

  const register = React.useCallback((e: FocusableEntry) => {
    entriesRef.current.set(e.id, e);
    force();
    return () => {
      entriesRef.current.delete(e.id);
      force();
    };
  }, []);

  const entries = React.useCallback(() => Array.from(entriesRef.current.values()), []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ctx: NavCtx = {
    register,
    entries,
    openPalette: () => setOpen(true),
    closePalette: () => setOpen(false),
  };

  return (
    <Ctx.Provider value={ctx}>
      {children}
      {open && (
        <div className="tui-cmdk-backdrop" onClick={() => setOpen(false)}>
          <Command className="tui-cmdk" onClick={(e) => e.stopPropagation()} label="Command Palette">
            <Command.Input placeholder="Type a command..." autoFocus />
            <Command.List>
              <Command.Empty>No results.</Command.Empty>
              {(Object.entries(groupBy(entries(), (e) => e.group ?? "Actions")) as [string, FocusableEntry[]][]).map(([group, items]) => (
                <Command.Group key={group} heading={group}>
                  {items.map((it) => (
                    <Command.Item
                      key={it.id}
                      value={`${group} ${it.label}`}
                      onSelect={() => {
                        it.onSelect();
                        setOpen(false);
                      }}
                    >
                      {it.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </div>
      )}
    </Ctx.Provider>
  );
}

function groupBy<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const k = key(item);
    (acc[k] ||= []).push(item);
    return acc;
  }, {});
}

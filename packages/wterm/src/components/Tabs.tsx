import * as React from "react";
import { useFocusable } from "../nav/useFocusable";

export type Tab = { id: string; label: string; content: React.ReactNode };
export type TabsProps = {
  tabs: Tab[];
  activeId: string;
  onChange: (id: string) => void;
};

export function Tabs({ tabs, activeId, onChange }: TabsProps) {
  return (
    <div>
      <div className="tui-tabs" role="tablist">
        {tabs.map((t) => (
          <TabHead key={t.id} tab={t} active={t.id === activeId} onSelect={() => onChange(t.id)} />
        ))}
      </div>
      <div style={{ padding: "var(--tui-pad-y) var(--tui-pad-x)" }}>
        {tabs.find((t) => t.id === activeId)?.content}
      </div>
    </div>
  );
}

function TabHead({ tab, active, onSelect }: { tab: Tab; active: boolean; onSelect: () => void }) {
  const f = useFocusable({ label: tab.label, group: "Tabs", onSelect });
  return (
    <span {...f} className={`${f.className} tui-tab`} role="tab" aria-selected={active}>
      {tab.label}
    </span>
  );
}

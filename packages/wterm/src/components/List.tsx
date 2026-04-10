import * as React from "react";
import { useFocusable } from "../nav/useFocusable";

export type ListItem = { id: string; label: string };
export type ListProps = {
  items: ListItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  group?: string;
};

export function List({ items, selectedId, onSelect, group }: ListProps) {
  return (
    <div className="tui-list" role="listbox">
      {items.map((it) => (
        <Row
          key={it.id}
          item={it}
          selected={selectedId === it.id}
          group={group}
          onSelect={() => onSelect(it.id)}
        />
      ))}
    </div>
  );
}

function Row({
  item, selected, group, onSelect,
}: { item: ListItem; selected: boolean; group?: string; onSelect: () => void }) {
  const f = useFocusable({ label: item.label, group, onSelect });
  return (
    <span {...f} className={`${f.className} tui-list-item`} role="option" aria-selected={selected}>
      {item.label}
    </span>
  );
}

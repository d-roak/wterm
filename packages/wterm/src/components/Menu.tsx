import * as React from "react";
import { Box } from "./Box";
import { List, ListItem } from "./List";

export type MenuProps = {
  title?: string;
  items: (ListItem & { onSelect: () => void })[];
};

export function Menu({ title, items }: MenuProps) {
  return (
    <Box title={title}>
      <List
        items={items}
        onSelect={(id) => items.find((i) => i.id === id)?.onSelect()}
        group={title}
      />
    </Box>
  );
}

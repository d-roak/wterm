import * as React from "react";
import { render } from "@testing-library/react";
import { NavProvider } from "../nav/NavProvider";

export function renderWithNav(ui: React.ReactElement) {
  return render(<NavProvider>{ui}</NavProvider>);
}

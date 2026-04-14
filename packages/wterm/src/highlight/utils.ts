export function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function span(cls: string, text: string) {
  return `<span class="${cls}">${esc(text)}</span>`;
}

export function spanRaw(cls: string, html: string) {
  return `<span class="${cls}">${html}</span>`;
}

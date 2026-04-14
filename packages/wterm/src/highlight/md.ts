import { esc, span, spanRaw } from "./utils";

export function highlightMd(src: string): string {
  return src.split("\n").map((line) => {
    if (/^#{1,6}\s/.test(line)) {
      const m = line.match(/^(#{1,6})\s(.*)$/)!;
      return span("hl-kw", m[1]) + " " + spanRaw("hl-tag", esc(m[2]));
    }
    let out = esc(line);
    out = out.replace(/`([^`]+)`/g, (_, c) => span("hl-str", "`" + c + "`"));
    out = out.replace(/\*\*(.+?)\*\*/g, (_, c) => spanRaw("hl-num", "**" + c + "**"));
    out = out.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, (_, c) => spanRaw("hl-fn", "*" + c + "*"));
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) =>
      span("hl-punc", "[") + spanRaw("hl-str", esc(text)) + span("hl-punc", "](") + spanRaw("hl-html", esc(url)) + span("hl-punc", ")")
    );
    if (/^\s*[-*+]\s/.test(line)) {
      out = out.replace(/^(\s*)([-*+])/, (_, ws, b) => ws + spanRaw("hl-kw", b));
    }
    return out;
  }).join("\n");
}

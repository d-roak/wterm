import { highlightJs } from "./js";
import { highlightCss } from "./css";
import { highlightHtml } from "./html";
import { highlightRust } from "./rust";
import { highlightPython } from "./python";
import { highlightMd } from "./md";
import { highlightShell } from "./shell";

export type Lang = "js" | "css" | "html" | "rust" | "python" | "md" | "shell";

export function detectLang(src: string): Lang {
  if (/^\s*(import |export |const |let |var |function |=>|<[A-Z])/.test(src)) return "js";
  if (/^\s*(<\w|<!DOCTYPE)/i.test(src)) return "html";
  if (/^\s*(\.|#|:root|@media|@keyframes|--[\w-]+\s*:)/.test(src) || /{\s*[\w-]+\s*:/.test(src)) return "css";
  if (/^\s*(fn |use |let mut |struct |impl |pub |mod |crate)/.test(src)) return "rust";
  if (/^\s*(def |class |import |from .+ import|if __name__)/.test(src)) return "python";
  if (/^\s*#\s|^\s*\*\*/.test(src)) return "md";
  if (/^\s*(\$|pnpm|npm|yarn|cargo|pip|brew)/.test(src)) return "shell";
  return "js";
}

export function highlight(src: string, lang: Lang): string {
  switch (lang) {
    case "js":     return highlightJs(src);
    case "css":    return highlightCss(src);
    case "html":   return highlightHtml(src);
    case "rust":   return highlightRust(src);
    case "python": return highlightPython(src);
    case "md":     return highlightMd(src);
    case "shell":  return highlightShell(src);
  }
}

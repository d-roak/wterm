import { esc, span } from "./utils";

const CMD = new Set([
  "pnpm","npm","yarn","npx","cargo","pip","brew","git","cd","ls",
  "mkdir","rm","cp","mv","cat","echo","curl","wget","sudo","docker",
]);

export function highlightShell(src: string): string {
  const re =
    /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'[^']*')|(&&|\|\||[|;])|(\b\d+(?:\.\d+)?\b)|(\$\w+)|(\b[\w./@-]+\b)|(\n)|(.)/g;

  let out = "";
  let m: RegExpExecArray | null;
  let isFirst = true;
  while ((m = re.exec(src)) !== null) {
    const [full, comment, str, op, num, envVar, word, nl] = m;
    if (comment) { out += span("hl-cmt", comment); }
    else if (str) { out += span("hl-str", str); }
    else if (op) { out += span("hl-kw", op); isFirst = true; }
    else if (num) { out += span("hl-num", num); }
    else if (envVar) { out += span("hl-prop", envVar); }
    else if (word) {
      if (CMD.has(word) || isFirst) { out += span("hl-fn", word); isFirst = false; }
      else if (word.startsWith("-")) out += span("hl-prop", word);
      else out += esc(word);
    }
    else if (nl) { out += "\n"; isFirst = true; }
    else { out += esc(full); }
  }
  return out;
}

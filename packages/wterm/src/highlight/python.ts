import { esc, span } from "./utils";

const KW = new Set([
  "def","class","import","from","as","return","if","elif","else",
  "for","while","in","is","not","and","or","try","except","finally",
  "raise","with","pass","break","continue","yield","lambda","del",
  "global","nonlocal","assert","async","await",
]);
const LIT = new Set(["True","False","None"]);

export function highlightPython(src: string): string {
  const re =
    /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(f"(?:[^"\\]|\\.)*"|f'(?:[^'\\]|\\.)*')|(@\w+)|(\b\d[\d_]*(?:\.\d+)?\b)|(\b[a-zA-Z_]\w*\b)|([{}()[\],;:.=+\-*/%<>!|&~^])|(\n)|(.)/g;

  let out = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const [full, comment, str, fstr, decorator, num, word, punc, nl] = m;
    if (comment) { out += span("hl-cmt", comment); }
    else if (str) { out += span("hl-str", str); }
    else if (fstr) { out += span("hl-str", fstr); }
    else if (decorator) { out += span("hl-fn", decorator); }
    else if (num) { out += span("hl-num", num); }
    else if (word) {
      if (KW.has(word)) out += span("hl-kw", word);
      else if (LIT.has(word)) out += span("hl-num", word);
      else if (/^[A-Z]/.test(word)) out += span("hl-tag", word);
      else if (/^\s*\(/.test(src.slice(re.lastIndex))) out += span("hl-fn", word);
      else out += esc(word);
    }
    else if (punc) { out += span("hl-punc", punc); }
    else if (nl) { out += "\n"; }
    else { out += esc(full); }
  }
  return out;
}

import { esc, span } from "./utils";

const KW = new Set([
  "fn","let","mut","const","static","struct","enum","impl","trait",
  "pub","mod","use","crate","self","super","Self","as","in","for",
  "loop","while","if","else","match","return","break","continue",
  "where","type","async","await","move","ref","dyn","unsafe","extern",
]);
const LIT = new Set(["true","false","None","Some","Ok","Err"]);

export function highlightRust(src: string): string {
  const re =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")|('[\w]+'|'(?:\\.|[^'\\])')|(#\[[\w:]+(?:\([^)]*\))?\])|(\b\d[\d_]*(?:\.[\d_]+)?(?:f32|f64|u8|u16|u32|u64|u128|i8|i16|i32|i64|i128|usize|isize)?\b)|(&'[\w]+\b)|(\b[a-zA-Z_]\w*\b)|([:]{2})|([{}()[\],;:.&|!<>=+\-*/%])|(\n)|(.)/g;

  let out = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const [full, comment, str, charLit, attr, num, lifetime, word, pathSep, punc, nl] = m;
    if (comment) { out += span("hl-cmt", comment); }
    else if (str) { out += span("hl-str", str); }
    else if (charLit) { out += span("hl-str", charLit); }
    else if (attr) { out += span("hl-fn", attr); }
    else if (num) { out += span("hl-num", num); }
    else if (lifetime) { out += span("hl-sky", lifetime); }
    else if (word) {
      if (KW.has(word)) out += span("hl-kw", word);
      else if (LIT.has(word)) out += span("hl-num", word);
      else if (/^[A-Z]/.test(word)) out += span("hl-tag", word);
      else if (/^\s*[!(]/.test(src.slice(re.lastIndex))) out += span("hl-fn", word);
      else out += esc(word);
    }
    else if (pathSep) { out += span("hl-punc", pathSep); }
    else if (punc) { out += span("hl-punc", punc); }
    else if (nl) { out += "\n"; }
    else { out += esc(full); }
  }
  return out;
}

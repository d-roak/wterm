import { esc, span } from "./utils";

const KW = new Set([
  "import","from","export","const","let","var","function","return",
  "default","if","else","new","typeof","type","interface","async",
  "await","class","extends","switch","case","break","for","while",
  "of","in","do","try","catch","finally","throw","yield","void",
  "delete","instanceof","this","super","static","as","is",
]);
const LIT = new Set(["true","false","null","undefined"]);

export function highlightJs(src: string): string {
  const re =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Z]\w*|<\/?[a-z]\w*)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_$]\w*\b)|(\/?>)|([{}()[\],;:.])|(\n)|(.)/g;

  let out = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const [full, comment, str, tag, num, word, closeTag, punc, nl] = m;
    if (comment) { out += span("hl-cmt", comment); }
    else if (str) { out += span("hl-str", str); }
    else if (tag) {
      const bracket = tag.match(/^(<\/?)(.+)$/)!;
      const isComponent = /^[A-Z]/.test(bracket[2]);
      out += esc(bracket[1]) + span(isComponent ? "hl-tag" : "hl-html", bracket[2]);
    }
    else if (num) { out += span("hl-num", num); }
    else if (word) {
      if (KW.has(word)) { out += span("hl-kw", word); }
      else if (LIT.has(word)) { out += span("hl-num", word); }
      else {
        const rest = src.slice(re.lastIndex);
        if (/^\s*=(?!=)/.test(rest)) out += span("hl-prop", word);
        else if (/^\s*\(/.test(rest)) out += span("hl-fn", word);
        else out += esc(word);
      }
    }
    else if (closeTag) { out += span("hl-punc", closeTag); }
    else if (punc) { out += span("hl-punc", punc); }
    else if (nl) { out += "\n"; }
    else { out += esc(full); }
  }
  return out;
}

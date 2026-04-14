import { esc, span } from "./utils";

const KW = new Set([
  "important","inherit","initial","unset","none","auto","solid","double",
  "dashed","dotted","block","inline","flex","grid","hidden","visible",
  "absolute","relative","fixed","sticky","italic","bold","normal",
  "transparent","ease","linear","both","forwards","backwards",
]);
const AT = new Set([
  "media","keyframes","import","font-face","supports","layer","property",
]);

export function highlightCss(src: string): string {
  const re =
    /(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@@?[\w-]+)|(\b\d+(?:\.\d+)?(?:%|px|em|rem|ch|vh|vw|vmin|vmax|s|ms|deg|fr)?\b)|(--[\w-]+)|([.#][\w-]+)|(:[\w-]+(?:\([^)]*\))?)|(\b[\w-]+\b(?=\s*:(?!:)))|(\b[\w-]+\b)|([{}();:,])|(\n)|(.)/g;

  let out = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const [full, comment, str, atRule, num, cssVar, selector, pseudo, prop, word, punc, nl] = m;
    if (comment) { out += span("hl-cmt", comment); }
    else if (str) { out += span("hl-str", str); }
    else if (atRule) {
      const name = atRule.replace(/^@+/, "");
      if (AT.has(name)) out += span("hl-kw", atRule);
      else out += span("hl-kw", atRule);
    }
    else if (num) { out += span("hl-num", num); }
    else if (cssVar) { out += span("hl-prop", cssVar); }
    else if (selector) { out += span("hl-tag", selector); }
    else if (pseudo) { out += span("hl-fn", pseudo); }
    else if (prop) { out += span("hl-html", prop); }
    else if (word) {
      if (KW.has(word)) out += span("hl-num", word);
      else if (/^\s*\(/.test(src.slice(re.lastIndex))) out += span("hl-fn", word);
      else out += esc(word);
    }
    else if (punc) { out += span("hl-punc", punc); }
    else if (nl) { out += "\n"; }
    else { out += esc(full); }
  }
  return out;
}

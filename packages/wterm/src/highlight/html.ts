import { esc, span } from "./utils";

export function highlightHtml(src: string): string {
  const re =
    /(<!--[\s\S]*?-->)|(<\/?)([\w-]+)|(\s)([\w-:]+)(=)("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\s)([\w-:]+)(=)|(\/?>\s*)|(\b\d+(?:\.\d+)?\b)|([{}])|(\n)|(.)/g;

  let out = "";
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    const [full, comment, bracket, tagName, ws1, attrName, eq, attrVal, ws2, attrOnly, eq2, closeBracket, num, brace, nl] = m;
    if (comment) { out += span("hl-cmt", comment); }
    else if (bracket && tagName) {
      out += span("hl-punc", bracket) + span("hl-html", tagName);
    }
    else if (ws1 && attrName && eq && attrVal) {
      out += ws1 + span("hl-punc", attrName) + span("hl-punc", eq) + span("hl-str", attrVal);
    }
    else if (ws2 && attrOnly && eq2) {
      out += ws2 + span("hl-punc", attrOnly) + span("hl-punc", eq2);
    }
    else if (closeBracket) { out += span("hl-punc", closeBracket); }
    else if (num) { out += span("hl-num", num); }
    else if (brace) { out += span("hl-punc", brace); }
    else if (nl) { out += "\n"; }
    else { out += esc(full); }
  }
  return out;
}

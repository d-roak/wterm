import * as React from "react";
import { highlight, detectLang, type Lang } from "../highlight";

export type CodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
  code: string;
  lang?: Lang;
};

export function CodeBlock({ code, lang, className = "", ...rest }: CodeBlockProps) {
  return (
    <pre className={`tui-codeblock ${className}`} {...rest}>
      <code dangerouslySetInnerHTML={{ __html: highlight(code, lang ?? detectLang(code)) }} />
    </pre>
  );
}

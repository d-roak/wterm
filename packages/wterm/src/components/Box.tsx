import * as React from "react";

export type BoxProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: string;
  double?: boolean;
};

export function Box({ title, double, className = "", children, ...rest }: BoxProps) {
  return (
    <div className={`tui-box ${className}`} data-double={double || undefined} {...rest}>
      {title && <span className="tui-box-title">{title}</span>}
      {children}
    </div>
  );
}

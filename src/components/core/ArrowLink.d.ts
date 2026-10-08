import * as React from 'react';
/** Inline text link with trailing arrow and hairline underline. */
export interface ArrowLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  /** Glyph after the label. Default →; use ↘ for in-page jumps. */
  arrow?: string;
  children?: React.ReactNode;
}
export declare function ArrowLink(props: ArrowLinkProps): JSX.Element;

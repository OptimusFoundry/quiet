import * as React from 'react';
/**
 * Code in a reply: mono, scrolls sideways rather than wrapping (unless `wrap`), with a language label
 * and a Copy button. No highlighter; pass highlighted `children` with `code` for the copy text.
 */
export interface CodeBlockProps {
  /** The source; also what Copy copies */
  code?: string;
  /** Rendered instead of `code` when given (e.g. pre-highlighted spans) */
  children?: React.ReactNode;
  language?: string;
  filename?: string;
  wrap?: boolean;
  /** Caps the height; the code scrolls */
  maxHeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function CodeBlock(props: CodeBlockProps): JSX.Element;

import * as React from 'react';
/**
 * Inline text link. Ink → molten on hover. For a standalone CTA link use ArrowLink.
 * @startingPoint section="Actions" subtitle="Inline text links" viewport="600x160"
 */
export interface LinkProps {
  href?: string;
  variant?: 'default' | 'primary' | 'muted';
  size?: 'inherit' | 'sm' | 'md' | 'lg';
  underline?: 'hover' | 'always' | 'none';
  /** Opens in new tab, appends ↗ */
  external?: boolean;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}
export declare function Link(props: LinkProps): JSX.Element;

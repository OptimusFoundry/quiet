import * as React from 'react';
/**
 * The two-column section head: ink top rule, eyebrow + headline left, intro + actions right.
 * @startingPoint section="Layout" subtitle="Two-column section heads" viewport="900x260"
 */
export interface SectionHeaderProps {
  index?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  accent?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'md' | 'sm';
  /** Heading level, e.g. h3 for nested sections */
  as?: 'h2' | 'h3' | 'h4';
  className?: string;
  style?: React.CSSProperties;
}
export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;

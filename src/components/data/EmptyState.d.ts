import * as React from 'react';
/**
 * Nothing-here state: ringed mono glyph, headline with period, one honest sentence, actions.
 * @startingPoint section="Data" subtitle="Empty and no-result states" viewport="700x360"
 */
export interface EmptyStateProps {
  /** Mono glyph in a ring; null hides it */
  icon?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  accent?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Dashed placeholder frame */
  bordered?: boolean;
  align?: 'center' | 'start';
  /** Heading level for the title; default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  style?: React.CSSProperties;
}
export declare function EmptyState(props: EmptyStateProps): JSX.Element;

import * as React from 'react';
/**
 * An empty state that shows what is likely to come: dashed ghost rows drawn from similar lists,
 * each folding away as a real row arrives. Ghosts are decorative (hidden from assistive tech);
 * the caption says where they come from.
 * @startingPoint section="Future" subtitle="Empty states that show the shape of success" viewport="700x360"
 */
export interface GhostFutureRow {
  label: React.ReactNode;
  /** When it usually happens, e.g. "day 3" */
  hint?: React.ReactNode;
}
export interface GhostFutureProps {
  /** The likely first rows, in order */
  ghosts?: GhostFutureRow[];
  /** The real rows so far; each one replaces the first remaining ghost */
  children?: React.ReactNode;
  /** Number of real rows, when children don't map one-to-one */
  count?: number;
  /** Where the ghosts come from; shown while any remain */
  caption?: React.ReactNode;
  /** Custom ghost content (the dashed row frame stays) */
  renderGhost?: (ghost: GhostFutureRow, index: number) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function GhostFuture(props: GhostFutureProps): JSX.Element;

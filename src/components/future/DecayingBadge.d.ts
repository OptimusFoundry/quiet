import * as React from 'react';
/**
 * A status badge whose fact ages. It fades from ink toward grey over `staleAfter`, then strikes
 * itself through; with `onRecheck` it is the button that refreshes the fact.
 * @startingPoint section="Future" subtitle="Status that shows its age" viewport="700x180"
 */
export interface DecayingBadgeProps {
  /** What was true when someone looked */
  children?: React.ReactNode;
  /** When the fact was last confirmed; missing means never */
  checkedAt?: Date | number | string;
  /** Milliseconds until the fact counts as stale (default 72 hours) */
  staleAfter?: number;
  /** Current time in ms; defaults to the clock, refreshed every 30s */
  now?: number;
  /** Shown, struck through, once stale */
  staleLabel?: React.ReactNode;
  /** Makes the badge a button that re-confirms the fact */
  onRecheck?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** A re-check is in flight */
  checking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}
export declare function DecayingBadge(props: DecayingBadgeProps): JSX.Element;

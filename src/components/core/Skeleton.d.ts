import * as React from 'react';
/**
 * Paper-2 loading placeholder with a slow 2s pulse.
 * @startingPoint section="Feedback" subtitle="Loading placeholders" viewport="600x240"
 */
export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: number | string;
  height?: number | string;
  /** text only: number of lines; last line is 60% */
  lines?: number;
  gap?: number;
  animate?: boolean;
  /** Announces loading: the placeholder becomes role="status" aria-busy with this name instead of aria-hidden */
  label?: string;
  /** false renders children instead; content that replaces a visible skeleton fades in */
  loading?: boolean;
  /** Content shown when loading is false (a single element gets the fade-in) */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;

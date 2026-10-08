import * as React from 'react';
/**
 * A container whose own edge is the progress bar: the border draws clockwise as the work
 * completes. Wraps a Card (or anything with the same radius) — no bar inside the content.
 * @startingPoint section="Future" subtitle="The edge is the progress" viewport="600x260"
 */
export interface BorderProgressProps {
  value?: number;
  max?: number;
  /** Unknown length: a short segment travels the edge */
  indeterminate?: boolean;
  /** Accessible name for the progress (a string), e.g. "Rendering 3 clips" */
  label?: React.ReactNode;
  /** Accessible name when there is no string label; defaults to "Progress" */
  'aria-label'?: string;
  /** Spoken value, e.g. "2 of 3 clips"; defaults to the percentage */
  valueText?: string;
  /** The container being drawn, e.g. a Card */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function BorderProgress(props: BorderProgressProps): JSX.Element;

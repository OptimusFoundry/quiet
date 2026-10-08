import * as React from 'react';
/**
 * A word-sized trend for KPIs and table cells. Molten by default with the last point dotted;
 * read out as one sentence (from, to, low, high).
 * @startingPoint section="Charts" subtitle="Inline trend" viewport="400x120"
 */
export interface SparklineProps {
  /** Values in order; null leaves a gap */
  data: (number | null)[];
  width?: number;
  height?: number;
  /** Faint fill under the line */
  area?: boolean;
  /** Dot on the last point (default true) */
  dot?: boolean;
  /** 'accent' (default, molten) or 'ink' for a quieter, secondary trend */
  tone?: 'accent' | 'ink';
  formatValue?: (value: number) => string;
  /** What the numbers are, e.g. "Signups, last 30 days" — prefixed to the spoken summary */
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Sparkline(props: SparklineProps): JSX.Element;

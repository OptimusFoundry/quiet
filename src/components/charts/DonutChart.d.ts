import * as React from 'react';
/**
 * Share of a total. Largest segment molten, the rest ink then greys, with a centre total that
 * turns into the active segment's share on hover or focus. Segments are focusable marks.
 * @startingPoint section="Charts" subtitle="Share of a total" viewport="600x260"
 */
export interface DonutChartDatum {
  id?: string | number;
  label: string;
  value: number;
  color?: string;
}
export interface DonutChartProps {
  data: DonutChartDatum[];
  /** Diameter in px (default 200) */
  size?: number;
  /** Ring thickness in px (default 22) */
  thickness?: number;
  /** Order largest first so the largest gets molten (default true) */
  sort?: boolean;
  formatValue?: (value: number) => string;
  /** Mono caption in the centre (default "Total") */
  centerLabel?: React.ReactNode;
  /** Centre figure (default: the formatted total) */
  centerValue?: React.ReactNode;
  /** Legend with shares beside the ring (default true) */
  legend?: boolean;
  title?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function DonutChart(props: DonutChartProps): JSX.Element;

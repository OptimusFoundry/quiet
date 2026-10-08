import * as React from 'react';
/**
 * Lines (optionally areas) over a shared x axis. Series 1 is molten, comparisons ink then greys
 * (series 4–5 dash). Crosshair + tooltip on hover; the plot is a slider over the x points, so
 * arrows move the same crosshair and the values are announced.
 * @startingPoint section="Charts" subtitle="Trends over time" viewport="800x320"
 */
export interface LineChartSeries {
  id?: string | number;
  name: string;
  /** One value per label; null leaves a gap */
  data: (number | null)[];
  /** Override the palette colour (CSS value) */
  color?: string;
  /** Fill under this series (default: only series 1 when the chart's `area` is on) */
  area?: boolean;
}
export interface LineChartProps {
  series: LineChartSeries[];
  /** X-axis labels, one per point */
  labels?: string[];
  /** Fill under the primary (first) series; comparisons stay lines */
  area?: boolean;
  /** Start the value axis at zero (default: true with `area`, else fit the data) */
  zero?: boolean;
  /** Height in px (default 220); width follows the container */
  height?: number;
  /** Approximate tick counts */
  yTicks?: number;
  xTicks?: number;
  formatValue?: (value: number) => string;
  formatLabel?: (label: string, index: number) => string;
  /** Dashed horizontal line, e.g. a target */
  reference?: { value: number; label?: string };
  /** Mark a point (ring + rule on series 1) and/or shade a range of indices */
  highlight?: { index?: number; range?: [number, number] };
  /** Show the legend (default: two or more series) */
  legend?: boolean;
  /** Visible caption; also the accessible name */
  title?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function LineChart(props: LineChartProps): JSX.Element;

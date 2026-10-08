import * as React from 'react';
/**
 * Bars by category, grouped or stacked, vertical or horizontal. Series 1 is molten, then ink and
 * greys; 2px surface gaps between fills; rounded data ends. Each bar is a focusable mark (one tab
 * stop, arrows move) with a tooltip.
 * @startingPoint section="Charts" subtitle="Compare categories" viewport="800x320"
 */
export interface BarChartSeries {
  id?: string | number;
  name: string;
  /** One value per category */
  data: number[];
  color?: string;
}
export interface BarChartProps {
  categories: string[];
  series: BarChartSeries[];
  orientation?: 'vertical' | 'horizontal';
  /** Stack series within a category instead of grouping them side by side */
  stacked?: boolean;
  /** Print values at the bar ends (totals when stacked) */
  valueLabels?: boolean;
  /** Height in px (default 240 vertical; horizontal sizes to its rows) */
  height?: number;
  formatValue?: (value: number) => string;
  yTicks?: number;
  /** Show the legend (default: two or more series) */
  legend?: boolean;
  title?: React.ReactNode;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function BarChart(props: BarChartProps): JSX.Element;

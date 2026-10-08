import * as React from 'react';
/** One legend entry: a name and the series colour it stands for. */
export interface ChartLegendItem {
  id?: string | number;
  name: React.ReactNode;
  /** CSS colour; defaults to the series palette by position */
  color?: string;
}
export interface ChartLegendProps {
  items: ChartLegendItem[];
  /** 'line' shows short strokes (dashed for series 4–5); 'dot' shows dots */
  kind?: 'dot' | 'line';
  className?: string;
  style?: React.CSSProperties;
}
/** Legend shared by quiet's charts; always shown for two or more series. */
export declare function ChartLegend(props: ChartLegendProps): JSX.Element;
export interface ChartTooltipRow {
  id?: string | number;
  name: React.ReactNode;
  value: React.ReactNode;
  color?: string;
}
export interface ChartTooltipProps {
  /** Anchor in px inside the plot */
  x: number;
  y: number;
  bounds: { width: number };
  title?: React.ReactNode;
  rows: ChartTooltipRow[];
}
/** Floating readout (aria-hidden — charts expose the same values to assistive tech themselves). */
export declare function ChartTooltip(props: ChartTooltipProps): JSX.Element;
export interface ChartTableProps {
  caption: React.ReactNode;
  columns: React.ReactNode[];
  rows: React.ReactNode[][];
}
/** The chart's data as a visually hidden table. */
export declare function ChartTable(props: ChartTableProps): JSX.Element;

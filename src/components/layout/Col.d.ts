import * as React from 'react';
/**
 * One cell of the 12-column grid. Use inside <Grid columns={12}>.
 * @startingPoint section="Layout" subtitle="12-column spans" viewport="900x200"
 */
export interface ColProps {
  /** 1–12 */
  span?: number;
  /** Span when the parent Grid is 720–960px wide. Default: span < 4 → 6, else span */
  spanMd?: number;
  /** Span when the parent Grid is under 720px. Default 12 */
  spanSm?: number;
  /** 1-based start column */
  start?: number;
  rowSpan?: number;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Col(props: ColProps): JSX.Element;

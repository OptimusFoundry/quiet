import * as React from 'react';
/**
 * CSS grid on the 8px scale. Fixed columns or responsive auto-fit by min child width.
 * @startingPoint section="Layout" subtitle="Grids — fixed or auto-fit" viewport="800x260"
 */
export interface GridProps {
  /** Count or a raw grid-template-columns string */
  columns?: number | string;
  /** Responsive auto-fit; overrides columns */
  minChildWidth?: number | string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  align?: React.CSSProperties['alignItems'];
  animated?: boolean;
  /** Container widths for sm / md breakpoints that Col reads. Default [720, 960] */
  breakpoints?: [number, number];
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Grid(props: GridProps): JSX.Element;

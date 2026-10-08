import * as React from 'react';
/**
 * Hairline-separated rows: leading, primary/secondary text, trailing meta. Interactive rows nudge an arrow.
 * @startingPoint section="Data" subtitle="Hairline lists" viewport="700x400"
 */
export interface ListProps {
  items?: Array<{ id?: string | number; primary: React.ReactNode; secondary?: React.ReactNode; leading?: React.ReactNode; trailing?: React.ReactNode; onClick?: () => void; href?: string; disabled?: boolean; selected?: boolean }>;
  groups?: Array<{ label?: React.ReactNode; items: Array<any> }>;
  size?: 'sm' | 'md' | 'lg';
  divided?: boolean;
  /** Boxed with a soft hairline */
  bordered?: boolean;
  /** Rows rise in on mount, 60ms apart */
  animated?: boolean;
  style?: React.CSSProperties;
}
export declare function List(props: ListProps): JSX.Element;

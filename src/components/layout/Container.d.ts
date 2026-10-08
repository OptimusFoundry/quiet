import * as React from 'react';
/**
 * Max-width page column with 32px gutters. 1280 by default.
 * @startingPoint section="Layout" subtitle="Max-width column" viewport="900x200"
 */
export interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | number;
  /** 32px side gutters */
  padded?: boolean;
  centered?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Container(props: ContainerProps): JSX.Element;

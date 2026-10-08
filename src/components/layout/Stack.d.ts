import * as React from 'react';
/**
 * Flex row/column on the 8px grid.
 * @startingPoint section="Layout" subtitle="Flex stacks on the 8px grid" viewport="700x200"
 */
export interface StackProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** xs 8 · sm 16 · md 24 · lg 32 · xl 48 · 2xl 64, or px */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: boolean;
  /** Children rise in, 60ms apart */
  animated?: boolean;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Stack(props: StackProps): JSX.Element;

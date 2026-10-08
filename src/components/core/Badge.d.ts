import * as React from 'react';
/**
 * Sans pill for counts and statuses. Status reads through the dot, not a color fill.
 * @startingPoint section="Primitives" subtitle="Counts and status pills" viewport="700x180"
 */
export interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  /** Leading status dot (on by default for success/warning/error) */
  dot?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Numeric badge; collapses to max+ */
  count?: number;
  max?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;

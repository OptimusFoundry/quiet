import * as React from 'react';
/**
 * Pill button. Ink primary, hairline secondary/outline, text ghost, ink→molten destructive. Never molten-filled.
 * @startingPoint section="Actions" subtitle="Pill buttons — variants, sizes, states" viewport="700x200"
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  /** Trailing → that nudges 4px on hover */
  arrow?: boolean;
  /** Shows a spinner and blocks clicks */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Icon-only button (circle). Pass aria-label. */
  icon?: React.ReactNode;
  /** Renders an <a> when set (LinkButton) */
  href?: string;
  onClick?: React.MouseEventHandler;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  [key: string]: any;
}
export declare function Button(props: ButtonProps): JSX.Element;

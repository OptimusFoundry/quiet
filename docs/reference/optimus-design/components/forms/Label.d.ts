import * as React from 'react';
/**
 * Mono caps field label with required mark, sub text, badge and trailing action.
 * @startingPoint section="Forms" subtitle="Field labels" viewport="600x200"
 */
export interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  /** Molten asterisk */
  required?: boolean;
  subText?: React.ReactNode;
  badge?: React.ReactNode;
  /** Right-aligned, e.g. a Link "Forgot?" */
  action?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Label(props: LabelProps): JSX.Element;

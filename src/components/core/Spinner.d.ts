import * as React from 'react';
/**
 * Hairline ring spinner. Linear, 0.9s, stops under reduced motion.
 * @startingPoint section="Feedback" subtitle="Hairline loading ring" viewport="600x140"
 */
export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  tone?: 'default' | 'muted' | 'paper' | 'molten';
  /** Mono caps label beside the ring */
  label?: string;
  style?: React.CSSProperties;
  /** Other attributes go on the role="status" root */
  [key: string]: any;
}
export declare function Spinner(props: SpinnerProps): JSX.Element;

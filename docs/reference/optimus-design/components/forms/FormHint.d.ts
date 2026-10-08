import * as React from 'react';
/**
 * Helper / error / success line under a field. Mono 11px.
 * @startingPoint section="Forms" subtitle="Helper, error, success" viewport="600x160"
 */
export interface FormHintProps {
  variant?: 'default' | 'error' | 'success';
  /** true = default glyph (i ! ✓); node = custom; false = none */
  icon?: boolean | React.ReactNode;
  hidden?: boolean;
  id?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function FormHint(props: FormHintProps): JSX.Element;

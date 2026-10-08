import * as React from 'react';
/**
 * Hairline progress bar. Ink by default; molten only for heat (process rail), warning, error.
 * @startingPoint section="Feedback" subtitle="Hairline progress" viewport="600x260"
 */
export interface ProgressProps {
  value?: number;
  max?: number;
  /** 1px · 2px · 4px */
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'heat';
  indeterminate?: boolean;
  label?: React.ReactNode;
  showValue?: boolean;
  /** Accessible name when there is no label; defaults to "Progress" */
  'aria-label'?: string;
  style?: React.CSSProperties;
}
export declare function Progress(props: ProgressProps): JSX.Element;

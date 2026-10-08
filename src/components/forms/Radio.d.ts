import * as React from 'react';
/**
 * Radio group. Options may carry description and disabled.
 * @startingPoint section="Forms" subtitle="Radio groups" viewport="600x220"
 */
export interface RadioProps {
  name?: string;
  /** Mono caps group label */
  label?: React.ReactNode;
  options: Array<string | { value: string; label: React.ReactNode; description?: React.ReactNode; disabled?: boolean }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  direction?: 'row' | 'column';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean | string;
  /** Group name when there is no visible label */
  'aria-label'?: string;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;

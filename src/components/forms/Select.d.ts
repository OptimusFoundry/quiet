import * as React from 'react';
/** Native select styled with soft --radius-md corners with a ↓ glyph. */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: React.ReactNode;
  options?: Array<string | { value: string; label: string; disabled?: boolean }>;
  /** Disabled first option with value ""; selected until the user picks */
  placeholder?: string;
  helperText?: React.ReactNode;
  /** true = molten edge; a node = edge + message (replaces helperText) */
  error?: boolean | React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Reaches the native <select> */
  ref?: React.Ref<HTMLSelectElement>;
}
export declare function Select(props: SelectProps): JSX.Element;

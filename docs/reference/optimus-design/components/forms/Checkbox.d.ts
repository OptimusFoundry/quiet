import * as React from 'react';
/**
 * Soft-cornered checkbox (--radius-xs), ink fill with ✓. Indeterminate, description, error, sizes.
 * @startingPoint section="Forms" subtitle="Soft checks" viewport="600x220"
 */
export interface CheckboxProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  /** Shows − and aria-checked="mixed" */
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  /** true = molten edge; string = edge + message */
  error?: boolean | string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;

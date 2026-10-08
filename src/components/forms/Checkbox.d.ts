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
  /** Accessible name when there is no visible label */
  'aria-label'?: string;
  /** Submits through a hidden input when set, so a native <form> and FormData see it */
  name?: string;
  /** Submitted while checked; default 'on' */
  value?: string;
  /** Blocks native submission while unchecked; also sets aria-required */
  required?: boolean;
  /** id of a <form> elsewhere in the document, as on native controls */
  form?: string;
  /** Reaches the role="checkbox" element, so it can be focused */
  ref?: React.Ref<HTMLSpanElement>;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;

import * as React from 'react';
/**
 * Labelled text input — icons, filled variant, sizes, hint and error. The full-featured Input.
 * @startingPoint section="Forms" subtitle="Labelled input with icons" viewport="600x260"
 */
export interface TextFieldProps {
  label?: React.ReactNode;
  /** Keep label for screen readers only */
  hideLabel?: boolean;
  required?: boolean;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  leftIcon?: React.ReactNode;
  /** Can be interactive, e.g. a show/hide toggle */
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Merged onto the native control (it is passed through with the other input props) */
  className?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  /** Reaches the native <input> */
  ref?: React.Ref<HTMLInputElement>;
  [key: string]: any;
}
export declare function TextField(props: TextFieldProps): JSX.Element;

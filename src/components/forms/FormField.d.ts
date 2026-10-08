import * as React from 'react';
/**
 * Label + any control + hint/error. Wire native controls automatically (id, aria).
 * @startingPoint section="Forms" subtitle="Label · control · hint" viewport="600x240"
 */
export interface FormFieldProps {
  label?: React.ReactNode;
  id?: string;
  required?: boolean;
  subText?: React.ReactNode;
  helperText?: React.ReactNode;
  /** Replaces helperText, molten */
  error?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** The control */
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function FormField(props: FormFieldProps): JSX.Element;

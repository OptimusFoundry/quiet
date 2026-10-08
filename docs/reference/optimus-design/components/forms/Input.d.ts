import * as React from 'react';
/**
 * Rounded text field with mono label.
 * @startingPoint section="Forms" subtitle="Text inputs, select, checks, switch" viewport="700x360"
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** Error text — border and message turn molten */
  error?: React.ReactNode;
  /** Render a textarea */
  multiline?: boolean;
}
export declare function Input(props: InputProps): JSX.Element;

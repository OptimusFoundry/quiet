import * as React from 'react';
/**
 * Labelled multi-line input with resize control and optional counter.
 * @startingPoint section="Forms" subtitle="Multi-line input" viewport="600x280"
 */
export interface TextAreaProps {
  label?: React.ReactNode;
  required?: boolean;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  rows?: number;
  resize?: 'none' | 'vertical' | 'both';
  /** Shows an n / max counter */
  maxLength?: number;
  disabled?: boolean;
  id?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  style?: React.CSSProperties;
  [key: string]: any;
}
export declare function TextArea(props: TextAreaProps): JSX.Element;

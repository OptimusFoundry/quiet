import * as React from 'react';
/**
 * Date field with a rounded month calendar. Today = molten dot, selected = ink circle.
 * @startingPoint section="Forms" subtitle="Calendar date picker" viewport="600x500"
 */
export interface DatePickerProps {
  label?: React.ReactNode;
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  min?: Date;
  max?: Date;
  /** 0 = Sunday, 1 = Monday */
  weekStartsOn?: 0 | 1;
  format?: (date: Date) => string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function DatePicker(props: DatePickerProps): JSX.Element;

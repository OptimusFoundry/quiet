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
  /** Submits the date as local YYYY-MM-DD (like <input type="date">), or "" when empty */
  name?: string;
  /** Blocks native submission while no date is picked */
  required?: boolean;
  /** id of a <form> elsewhere in the document, as on native controls */
  form?: string;
  /** Reaches the trigger button, so it can be focused */
  ref?: React.Ref<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
}
export declare function DatePicker(props: DatePickerProps): JSX.Element;

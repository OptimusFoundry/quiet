import * as React from 'react';
/**
 * Custom select with a rounded, softly shadowed listbox. Icons, descriptions, dividers, disabled items, keyboard.
 * @startingPoint section="Forms" subtitle="Custom select menu" viewport="600x420"
 */
export interface DropdownProps {
  label?: React.ReactNode;
  options: Array<string | { value: string; label: React.ReactNode; description?: React.ReactNode; icon?: React.ReactNode; disabled?: boolean } | { divider: true }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  fullWidth?: boolean;
  /** Menu alignment against the trigger */
  align?: 'start' | 'end';
  disabled?: boolean;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  /** Submits through a hidden input when set, so a native <form> and FormData see it */
  name?: string;
  /** Blocks native submission while empty; also sets aria-required */
  required?: boolean;
  /** id of a <form> elsewhere in the document, as on native controls */
  form?: string;
  /** Reaches the combobox trigger, so it can be focused */
  ref?: React.Ref<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Dropdown(props: DropdownProps): JSX.Element;

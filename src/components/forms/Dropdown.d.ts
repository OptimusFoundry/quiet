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
  style?: React.CSSProperties;
}
export declare function Dropdown(props: DropdownProps): JSX.Element;

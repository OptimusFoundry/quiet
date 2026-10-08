import * as React from 'react';
/**
 * Multi-value select. Chosen values show as removable mono pills; menu has checkboxes, filter, and clear.
 * @startingPoint section="Forms" subtitle="Multi-value select" viewport="600x460"
 */
export interface MultiSelectProps {
  label?: React.ReactNode;
  options: Array<string | { value: string; label: React.ReactNode; description?: React.ReactNode; disabled?: boolean } | { divider: true }>;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled';
  fullWidth?: boolean;
  /** Pills before collapsing to +n */
  maxDisplay?: number;
  /** Filter box; on automatically above 8 options */
  searchable?: boolean;
  disabled?: boolean;
  helperText?: React.ReactNode;
  error?: React.ReactNode;
  /** Submits one hidden input per chosen value (read with FormData.getAll) */
  name?: string;
  /** Blocks native submission while empty; also sets aria-required */
  required?: boolean;
  /** id of a <form> elsewhere in the document, as on native controls */
  form?: string;
  /** Reaches the role="combobox" element, so it can be focused */
  ref?: React.Ref<HTMLSpanElement>;
  className?: string;
  style?: React.CSSProperties;
}
export declare function MultiSelect(props: MultiSelectProps): JSX.Element;

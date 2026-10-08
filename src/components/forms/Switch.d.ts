import * as React from 'react';
/**
 * Pill switch for immediate settings. Ink when on.
 * @startingPoint section="Forms" subtitle="Pill toggles" viewport="600x200"
 */
export interface SwitchProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** left = settings-row layout */
  labelPosition?: 'left' | 'right';
  /** Accessible name when there is no visible label */
  'aria-label'?: string;
  /** Submits through a hidden input when set, so a native <form> and FormData see it */
  name?: string;
  /** Submitted while on; default 'on' */
  value?: string;
  /** Blocks native submission while off; also sets aria-required */
  required?: boolean;
  /** id of a <form> elsewhere in the document, as on native controls */
  form?: string;
  /** Reaches the role="switch" element, so it can be focused */
  ref?: React.Ref<HTMLSpanElement>;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;

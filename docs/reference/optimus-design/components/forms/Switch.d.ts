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
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;

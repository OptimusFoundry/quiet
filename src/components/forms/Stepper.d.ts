import * as React from 'react';
/**
 * Numeric stepper − value +. Pill-shaped hairline box.
 * @startingPoint section="Forms" subtitle="Number stepper" viewport="500x140"
 */
export interface StepperProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Accessible name */
  label?: string;
  /** Id for the value field (spinbutton); FormField sets it so its Label points here */
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'aria-required'?: boolean;
  style?: React.CSSProperties;
}
export declare function Stepper(props: StepperProps): JSX.Element;
export declare namespace Stepper {
  /** FormField wires id / aria-* into controls that set this */
  const fieldControl: boolean;
}

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
  style?: React.CSSProperties;
}
export declare function Stepper(props: StepperProps): JSX.Element;

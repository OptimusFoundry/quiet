import * as React from 'react';
/**
 * Hairline range slider with ink thumb. Pointer + keyboard.
 * @startingPoint section="Forms" subtitle="Range slider" viewport="600x160"
 */
export interface SliderProps {
  label?: React.ReactNode;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  showValue?: boolean;
  formatValue?: (value: number) => React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Accessible name when there is no visible label */
  'aria-label'?: string;
  style?: React.CSSProperties;
}
export declare function Slider(props: SliderProps): JSX.Element;

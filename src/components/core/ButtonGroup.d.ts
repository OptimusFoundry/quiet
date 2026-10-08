import * as React from 'react';
/**
 * Groups Buttons — spaced or attached into one pill.
 * @startingPoint section="Actions" subtitle="Spaced or attached button sets" viewport="700x200"
 */
export interface ButtonGroupProps {
  children?: React.ReactNode;
  /** Join into one segmented pill with hairline separators */
  attached?: boolean;
  vertical?: boolean;
  spacing?: 'sm' | 'md' | 'lg' | number;
  fullWidth?: boolean;
  /** Accessible name for the role="group" (e.g. "Text formatting") */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function ButtonGroup(props: ButtonGroupProps): JSX.Element;

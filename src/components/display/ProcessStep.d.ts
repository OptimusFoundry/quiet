import * as React from 'react';
/** One pass of the forge process: rail, roman numeral, title, description. */
export interface ProcessStepProps {
  /** Lowercase roman numeral: i, ii, iii, iv */
  numeral: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** Heated — rail and numeral turn molten (1s linear) */
  hot?: boolean;
  style?: React.CSSProperties;
}
export declare function ProcessStep(props: ProcessStepProps): JSX.Element;

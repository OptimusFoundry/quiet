import * as React from 'react';
/** One pass of the forge process: rail, roman numeral, title, description. */
export interface ProcessStepProps {
  /** Lowercase roman numeral: i, ii, iii, iv */
  numeral: string;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** Heated — rail and numeral turn molten (1s linear) */
  hot?: boolean;
  /** Heading level for the title; default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  style?: React.CSSProperties;
}
export declare function ProcessStep(props: ProcessStepProps): JSX.Element;

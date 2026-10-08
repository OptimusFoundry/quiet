import * as React from 'react';
/** Mono section label: "01 The studio". */
export interface EyebrowProps {
  /** Serial number shown in ink before the label, e.g. "01" */
  index?: string;
  tone?: 'muted' | 'ink';
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;

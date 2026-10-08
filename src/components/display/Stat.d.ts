import * as React from 'react';
/** Big tight number with mono label. */
export interface StatProps {
  value: React.ReactNode;
  label: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Stat(props: StatProps): JSX.Element;

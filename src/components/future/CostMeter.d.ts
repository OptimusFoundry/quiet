import * as React from 'react';
/**
 * Live agent spend, split by kind of work, each line against its own cap. The total sits large;
 * a line at or past `warnAt` of its cap turns its hairline bar molten and marks the figure.
 * @startingPoint section="Future" subtitle="Spend by kind of work" viewport="600x300"
 */
export interface CostMeterItem {
  id?: string | number;
  /** Kind of work, e.g. "Rendering clips" */
  label: React.ReactNode;
  /** Spent so far */
  value: number;
  /** Cap for this kind of work; omit for no bar */
  cap?: number;
}
export interface CostMeterProps {
  /** Mono caption above the total, e.g. "Agents · today" */
  label: React.ReactNode;
  items: CostMeterItem[];
  /** Overall budget for the period */
  budget?: number;
  /** Word after the budget, e.g. "daily" */
  period?: string;
  /** Number → display string (default "$0.00") */
  format?: (value: number) => string;
  /** Share of a cap at which a line warns (default 0.9) */
  warnAt?: number;
  className?: string;
  style?: React.CSSProperties;
}
export declare function CostMeter(props: CostMeterProps): JSX.Element;

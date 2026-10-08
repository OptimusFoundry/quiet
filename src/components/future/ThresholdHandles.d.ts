import * as React from 'react';
/**
 * Alert thresholds as lines dragged on the chart itself. Bars outside the band are the alerts that
 * would have fired, and the count updates as you move a line — sensitivity set with the false
 * positives in view. Each line is a vertical slider (arrows, PageUp/PageDown, Home/End).
 * Evolved from the alert rule form.
 * @startingPoint section="Future" subtitle="Threshold handles" viewport="700x260"
 */
export interface ThresholdValue {
  /** Lower line; omit for a high-only alert */
  low?: number;
  /** Upper line; omit for a low-only alert */
  high?: number;
}
export interface ThresholdHandlesProps {
  /** The history the thresholds are tested against, oldest first */
  data: number[];
  value?: ThresholdValue;
  defaultValue?: ThresholdValue;
  onChange?: (value: ThresholdValue) => void;
  min?: number;
  /** Top of the chart; default 1.2 × the largest value */
  max?: number;
  step?: number;
  label?: React.ReactNode;
  formatValue?: (value: number) => React.ReactNode;
  /** Summary line; default "Would have fired N× in <data.length>" */
  summary?: (fires: number, total: number) => React.ReactNode;
  lowLabel?: string;
  highLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function ThresholdHandles(props: ThresholdHandlesProps): JSX.Element;

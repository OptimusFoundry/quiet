import * as React from 'react';
import type { LineChartProps } from './LineChart';
/**
 * A line chart that comes with its reading: short sentences, each a button that marks the point
 * or range it talks about. The narration is passed in, not generated.
 * @startingPoint section="Charts" subtitle="A chart with its reading" viewport="800x460"
 */
export interface NarratedChartBeat {
  /** One short sentence */
  text: React.ReactNode;
  /** Point to mark (index into the labels) */
  index?: number;
  /** Range of indices to shade */
  range?: [number, number];
}
export interface NarratedChartProps extends Omit<LineChartProps, 'highlight'> {
  beats: NarratedChartBeat[];
  /** Controlled current beat */
  beat?: number;
  defaultBeat?: number;
  onBeatChange?: (beat: number) => void;
}
export declare function NarratedChart(props: NarratedChartProps): JSX.Element;

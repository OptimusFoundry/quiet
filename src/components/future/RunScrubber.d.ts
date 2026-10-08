import * as React from 'react';
/**
 * Scrub a finished agent run like a video. The thumb is a slider over the steps (arrows,
 * Home/End, PageUp/PageDown, or drag); the panel shows what the agent was thinking at that step,
 * and `actions` can branch or correct from there.
 * @startingPoint section="Future" subtitle="Replay a run, step by step" viewport="680x300"
 */
export interface RunScrubberStep {
  /** Short step name, shown under the track and spoken by the slider */
  label: string;
  /** The state or reasoning at this step */
  detail?: React.ReactNode;
}
export interface RunScrubberProps {
  steps: RunScrubberStep[];
  /** Zero-based step index */
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  /** Accessible name of the slider (default "Run") */
  label?: string;
  /** Mark for the agent beside the panel; decorative */
  agent?: React.ReactNode;
  /** Panel caption (default "Step 3 · Look at Beta · EU") */
  caption?: (index: number, step: RunScrubberStep) => React.ReactNode;
  /** Buttons under the panel; a function receives the current step */
  actions?: React.ReactNode | ((index: number, step: RunScrubberStep) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
}
export declare function RunScrubber(props: RunScrubberProps): JSX.Element;

import * as React from 'react';
export interface ConsensusPosition {
  /** Person or agent name — shown as an avatar (or the agent mark) and announced */
  name: string;
  value: number;
  /** Avatar image */
  src?: string;
  /** Show the agent mark instead of an avatar */
  agent?: boolean;
}
/**
 * A shared setting that shows where teammates and agents set theirs, as markers above the track,
 * with the spread band between the lowest and highest. Agreement is the band narrowing.
 * Evolved from Slider + comments.
 * @startingPoint section="Future" subtitle="Consensus slider" viewport="700x220"
 */
export interface ConsensusSliderProps {
  label?: React.ReactNode;
  /** Your position */
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  /** Everyone else's positions */
  others?: ConsensusPosition[];
  formatValue?: (value: number) => React.ReactNode;
  /** A spread at or under this reads "close to agreement"; omit to say nothing */
  closeWithin?: number;
  meetLabel?: React.ReactNode;
  /** Show the button that moves you to the mean of everyone else's positions */
  showMeet?: boolean;
  disabled?: boolean;
  /** Accessible name when there is no visible label */
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function ConsensusSlider(props: ConsensusSliderProps): JSX.Element;

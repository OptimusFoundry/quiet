import * as React from 'react';
export interface ProbabilityLevel {
  /** Highest position (0–100, inclusive) that still reads as this level */
  upTo: number;
  /** Short policy name, e.g. "Mostly" — also the slider's aria-valuetext */
  label: string;
  /** The policy said back in words, e.g. "Posts alone unless the draft mentions pricing." */
  description?: React.ReactNode;
}
/**
 * A switch that rests anywhere between off and always. The position (0–100) maps to a policy
 * level, read back as a label and a sentence. Evolved from Switch.
 * @startingPoint section="Future" subtitle="Probability toggle" viewport="700x180"
 */
export interface ProbabilityToggleProps {
  label?: React.ReactNode;
  /** Ordered by `upTo`; the last one should reach 100 */
  levels?: ProbabilityLevel[];
  /** 0–100 */
  value?: number;
  defaultValue?: number;
  onChange?: (value: number, level: ProbabilityLevel) => void;
  /** Arrow-key step (PageUp/PageDown move 25) */
  step?: number;
  disabled?: boolean;
  /** Accessible name when there is no visible label */
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare const PROBABILITY_LEVELS: ProbabilityLevel[];
export declare function ProbabilityToggle(props: ProbabilityToggleProps): JSX.Element;

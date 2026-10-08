import * as React from 'react';
/**
 * A slider that resists past its safe line instead of showing a validation error. Past `safe` a
 * drag loses leverage and springs back on release, and the keyboard stops at the line, unless the
 * override is held. Evolved from Slider + validation.
 * @startingPoint section="Future" subtitle="Elastic slider" viewport="700x200"
 */
export interface ElasticSliderProps {
  label?: React.ReactNode;
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  /** The safe limit. Omit for a plain slider with no resistance. */
  safe?: number;
  onChange?: (value: number) => void;
  /** Explicitly taking responsibility: lets the value stay past `safe` */
  override?: boolean;
  defaultOverride?: boolean;
  onOverrideChange?: (held: boolean) => void;
  overrideLabel?: React.ReactNode;
  overrideOnLabel?: React.ReactNode;
  /** Shown under the track (and read as the slider's description) */
  hint?: React.ReactNode;
  /** Replaces `hint` while the value is past the safe line */
  overHint?: React.ReactNode;
  formatValue?: (value: number) => React.ReactNode;
  disabled?: boolean;
  /** Accessible name when there is no visible label */
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function ElasticSlider(props: ElasticSliderProps): JSX.Element;

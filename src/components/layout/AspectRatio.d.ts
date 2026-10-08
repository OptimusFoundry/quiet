import * as React from 'react';
/**
 * Fixed-ratio frame. Covers img/video children; empty = dashed placeholder with a mono label.
 * @startingPoint section="Layout" subtitle="Ratio frames + placeholders" viewport="800x300"
 */
export interface AspectRatioProps {
  /** Preset or width/height number */
  ratio?: 'square' | 'video' | 'portrait' | 'wide' | 'photo' | number;
  /** Placeholder label when empty, e.g. "Product shot" */
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function AspectRatio(props: AspectRatioProps): JSX.Element;

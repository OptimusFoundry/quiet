import * as React from 'react';
/**
 * Blur that grows stronger toward one edge, built from stacked backdrop-filter bands. Fades
 * content under a sticky header, a caption or the end of a scroll area. Decorative: the bands are
 * hidden from assistive tech and never take pointer events.
 * @startingPoint section="Future" subtitle="Blur that ramps to an edge" viewport="600x320"
 */
export interface ProgressiveBlurProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The edge the blur ramps toward */
  direction?: 'top' | 'bottom' | 'left' | 'right';
  /** Blur in px reached at the edge; defaults to --q-progressive-blur-max (28px) */
  maxBlur?: number;
  /** Number of bands in progressive mode; more is smoother and costs more */
  layers?: number;
  /** Percent from the opposite edge where the blur begins */
  start?: number;
  /** "masked" is the usual single blur faded by a mask, kept for comparisons */
  mode?: 'progressive' | 'masked';
  children?: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
}
export declare function ProgressiveBlur(props: ProgressiveBlurProps): JSX.Element;

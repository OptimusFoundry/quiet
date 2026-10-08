import * as React from 'react';
/**
 * A table number that carries its doubt. Forecasts get a small track beside the number with their
 * range shaded on the column's shared `domain`; measured values (no range) are set heavier.
 * Screen readers hear the range ("5,400, likely between 4,780 and 6,020"). Use it in a Table
 * column's `render`. Evolved from plain numeric cells.
 * @startingPoint section="Future" subtitle="Uncertainty cell" viewport="700x240"
 */
export interface UncertaintyCellProps {
  value: number;
  /** Symmetric error: shown as ±error, range value−error … value+error */
  error?: number;
  /** Asymmetric bounds (override `error`) */
  low?: number;
  high?: number;
  /** The column's scale [min, max] — pass the same one to every cell so bands compare. Default: 0 … the cell's high */
  domain?: [number, number];
  format?: (value: number) => string;
  /** Hide the band but keep the ± text and the heavier/lighter weights */
  showBand?: boolean;
  /** Spoken text for an uncertain value; default "<value>, likely between <low> and <high>" */
  describe?: (value: number, low: number, high: number) => string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function UncertaintyCell(props: UncertaintyCellProps): JSX.Element;

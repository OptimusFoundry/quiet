import * as React from 'react';
/**
 * A thin ribbon along a series (or above a table) marking where something unexpected happened.
 * Each mark is a button (arrow keys move between them, one tab stop); selecting one announces what
 * it is and lifts its neighbourhood in the series. Evolved from manual scanning.
 * @startingPoint section="Future" subtitle="Anomaly ribbon" viewport="700x220"
 */
export interface Anomaly {
  /** Position in the series (0-based) */
  at: number;
  /** Short name, e.g. a date: "Sep 18" */
  label: string;
  /** What's unexpected, e.g. "+38 vs expected" */
  detail?: string;
}
export interface AnomalyRibbonProps {
  anomalies: Anomaly[];
  /** Series length when there's no `data` (e.g. a ribbon above a table of N rows) */
  count?: number;
  /** Draws the series under the ribbon as bars */
  data?: number[];
  /** Selected anomaly position (controlled); null for none */
  selected?: number | null;
  defaultSelected?: number | null;
  /** Called with the anomaly's `at`, or null when it's deselected — use it to jump there */
  onSelect?: (at: number | null) => void;
  /** Accessible name of the group of marks */
  label?: string;
  /** Replaces "N anomalies in <count>" */
  summary?: React.ReactNode;
  /** Your own series or table, rendered under the ribbon */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function AnomalyRibbon(props: AnomalyRibbonProps): JSX.Element;

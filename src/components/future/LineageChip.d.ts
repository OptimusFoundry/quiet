import * as React from 'react';
/**
 * A freshness chip on a number. It says whether everything upstream is fresh; pressing it
 * unfolds the lineage — sources, joins, the value — and marks the step that is late.
 * @startingPoint section="Future" subtitle="Where a number came from" viewport="700x200"
 */
export interface LineageStep {
  id?: string;
  /** Table, job or metric name */
  label: React.ReactNode;
  /** Short note, e.g. "40 min late" or "join on user_id" */
  detail?: React.ReactNode;
  /** This step is behind; the chip turns to attention */
  stale?: boolean;
}
export interface LineageChipProps {
  /** What the number is, for the accessible name ("lineage of MRR") */
  label?: string;
  /** Source first, the value last */
  steps?: LineageStep[];
  /** Age shown when everything is fresh, e.g. "4 min" */
  freshness?: React.ReactNode;
  /** Overrides the computed chip text */
  summary?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: 'sm' | 'md';
  className?: string;
  style?: React.CSSProperties;
}
export declare function LineageChip(props: LineageChipProps): JSX.Element;

import * as React from 'react';
/**
 * Inline, word-level suggestions instead of "regenerate". Each hunk shows the struck original and
 * the proposed words with accept (✓) and keep (×) keys; a resolved hunk can be reopened. The ship
 * button stays disabled while any hunk is pending.
 * @startingPoint section="Future" subtitle="Accept suggestions hunk by hunk" viewport="760x300"
 */
export interface DraftDiffHunk {
  id?: string | number;
  /** Unchanged text before the hunk */
  keep?: React.ReactNode;
  /** Original words */
  before: React.ReactNode;
  /** Suggested words */
  after: React.ReactNode;
  /** Unchanged text after the hunk */
  tail?: React.ReactNode;
}
export type DraftDiffState = 'pending' | 'accepted' | 'rejected';
export interface DraftDiffProps {
  hunks: DraftDiffHunk[];
  /** Controlled state per hunk */
  value?: DraftDiffState[];
  /** Initial state per hunk; all pending by default */
  defaultValue?: DraftDiffState[];
  onChange?: (value: DraftDiffState[]) => void;
  /** Who suggests what, e.g. "Meerkat suggests 3 edits" (also the section's accessible name) */
  label?: React.ReactNode;
  /** The suggestion's intent, e.g. "shorter, one claim per sentence" */
  note?: React.ReactNode;
  shipLabel?: React.ReactNode;
  onShip?: () => void;
  className?: string;
  style?: React.CSSProperties;
}
export declare function DraftDiff(props: DraftDiffProps): JSX.Element;

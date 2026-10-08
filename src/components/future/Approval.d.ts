import * as React from 'react';
/**
 * Replaces the confirm dialog. Shows exactly what changes (before → after), how far it reaches,
 * and how long it stays undoable; the commit is a hold-to-confirm key.
 * @startingPoint section="Future" subtitle="Approve an agent's plan" viewport="760x320"
 */
export interface ApprovalChange {
  id?: string | number;
  /** What changes, e.g. a campaign name */
  label: React.ReactNode;
  /** Current state — strings render as a quiet badge */
  before: React.ReactNode;
  /** Resulting state — strings render as an outline badge */
  after: React.ReactNode;
  /** Blast radius for this row, e.g. "1,240 people" (mono, right-aligned) */
  meta?: React.ReactNode;
}
export interface ApprovalConsequence {
  /** Optional leading glyph, e.g. "↺" */
  glyph?: string;
  label: React.ReactNode;
}
export interface ApprovalProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  changes?: ApprovalChange[];
  /** Undo window, notices sent, etc. Plain strings are fine */
  consequences?: Array<ApprovalConsequence | string>;
  /** Label on the hold button */
  confirmLabel?: React.ReactNode;
  /** Label once held, e.g. "Paused · undo for 24h" */
  confirmedLabel?: React.ReactNode;
  onConfirm?: () => void;
  /** Hold duration in ms (default 900) */
  holdDuration?: number;
  /** Shown beside the hold button until confirmed, e.g. an "Edit plan" ghost Button */
  secondaryAction?: React.ReactNode;
  /** Controlled confirmed state */
  confirmed?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Approval(props: ApprovalProps): JSX.Element;

import * as React from 'react';
/**
 * A receipt instead of a toast: who acted and why, one line per effect, and an undo on every
 * line that can be undone on its own.
 * @startingPoint section="Future" subtitle="What an agent did, line by line" viewport="700x320"
 */
export interface ReceiptLine {
  id?: string;
  /** "Paused", "Sent", "Kept" */
  verb?: React.ReactNode;
  /** What it happened to */
  object: React.ReactNode;
  /** false for effects that can't be taken back on their own */
  undoable?: boolean;
  /** Controlled: the effect has been undone */
  undone?: boolean;
}
export interface ReceiptProps {
  /** Who acted, e.g. "Meerkat" */
  actor: React.ReactNode;
  /** When, e.g. "14:02" */
  time?: React.ReactNode;
  /** A short reference, e.g. "#4f2a" */
  reference?: React.ReactNode;
  /** Why it acted */
  reason?: React.ReactNode;
  lines?: ReceiptLine[];
  /** Called when a line is undone; lines without `undone` track it themselves */
  onUndo?: (line: ReceiptLine, index: number) => void;
  undoLabel?: string;
  undoneLabel?: string;
  /** Usually the undo window, e.g. "Reversible until tomorrow 14:02" */
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Receipt(props: ReceiptProps): JSX.Element;

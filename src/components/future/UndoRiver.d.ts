import * as React from 'react';
/**
 * Everything anyone (or any agent) did drifts downstream for a day, dimming as it ages; anything
 * still in the river can be pulled back. Undo becomes a place, not a keystroke. One tab stop;
 * arrows move along the river, newest first; an undo is announced.
 * @startingPoint section="Future" subtitle="Undo as a place" viewport="720x220"
 */
export interface UndoRiverItem {
  id: string | number;
  /** What was done, e.g. "Paused Founding members" */
  label: string;
  /** Who did it, e.g. "Ada Park" or "Meerkat" */
  by?: string;
  /** you = molten dot, agent = ink square, person = hollow dot */
  kind?: 'you' | 'person' | 'agent';
  /** When it happened */
  at: number | string | Date;
}
export interface UndoRiverProps {
  items: UndoRiverItem[];
  /** Current time; without it the river re-reads the clock every 30s */
  now?: number;
  /** How long an action stays undoable, in ms (default 24h) */
  window?: number;
  onUndo?: (item: UndoRiverItem) => void;
  /** Accessible name of the list (default "Recent actions") */
  label?: string;
  startLabel?: React.ReactNode;
  endLabel?: React.ReactNode;
  /** Line under the river before anything is undone */
  hint?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function UndoRiver(props: UndoRiverProps): JSX.Element;

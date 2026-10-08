import * as React from 'react';
/**
 * A timeline of snapshots you can scrub when people and agents both edit. Agent snapshots are
 * square, human ones round. Arrow keys move between snapshots; Enter restores the selected one.
 * @startingPoint section="Future" subtitle="Scrubbable shared history" viewport="760x240"
 */
export interface Checkpoint {
  id?: string;
  /** What changed, e.g. "Paused 3 campaigns" */
  label: string;
  /** Who made it */
  who?: string;
  /** When, e.g. "14:02" */
  time?: string;
  /** Made by an agent (square mark) rather than a person (round) */
  agent?: boolean;
  /** How many changes this snapshot made (default 1); restoring before it reverts them */
  changes?: number;
}
export interface CheckpointsProps {
  /** Oldest first; the last one is the current state */
  checkpoints?: Checkpoint[];
  /** Selected index (controlled) */
  value?: number;
  /** Initially selected index (default: the current state) */
  defaultValue?: number;
  onChange?: (index: number) => void;
  /** Restore the selected snapshot; without it the Restore button is disabled */
  onRestore?: (checkpoint: Checkpoint, index: number) => void;
  /** Accessible name for the timeline (default "Checkpoints") */
  label?: string;
  restoreLabel?: string;
  currentLabel?: string;
  /** Noun used in "reverts 3 later changes" */
  changeWord?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Checkpoints(props: CheckpointsProps): JSX.Element;

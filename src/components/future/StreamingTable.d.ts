import * as React from 'react';
import type { TableProps } from '../data/Table';
/**
 * A live Table (newest rows first) that never moves under your hand. While it's paused, scrolled
 * down or has focus inside, new rows wait behind a "Show N new" bar and come in all at once;
 * otherwise they arrive at the top and glow once. Arrivals are announced politely, batched.
 * Evolved from auto-refresh.
 * @startingPoint section="Future" subtitle="Streaming table" viewport="800x360"
 */
export interface StreamingTableProps {
  /** The latest rows, newest first. Pass a new array as rows arrive. */
  rows: any[];
  columns: TableProps['columns'];
  /** Field name or getter; default 'id' */
  rowKey?: string | ((row: any) => any);
  paused?: boolean;
  defaultPaused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  /** Show at most this many rows */
  maxRows?: number;
  /** Scroll inside the table above this height (scrolling down holds new rows) */
  maxHeight?: number | string;
  caption?: React.ReactNode;
  /** Accessible name when there is no caption */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  liveLabel?: React.ReactNode;
  pausedLabel?: React.ReactNode;
  pauseLabel?: React.ReactNode;
  resumeLabel?: React.ReactNode;
  /** Text of the bar that lets waiting rows in; default "Show N new" */
  newLabel?: (count: number) => React.ReactNode;
  /** Announcements are batched to at most one per this many ms (default 2000) */
  announceEvery?: number;
  className?: string;
  style?: React.CSSProperties;
}
export declare function StreamingTable(props: StreamingTableProps): JSX.Element;

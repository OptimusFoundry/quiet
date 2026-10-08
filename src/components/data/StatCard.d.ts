import * as React from 'react';
/**
 * Dashboard metric. Mono label, 40px 700 value, mono delta with ↗ / ↘ glyph.
 * @startingPoint section="Data" subtitle="Dashboard metrics" viewport="800x240"
 */
export interface StatCardProps {
  label: React.ReactNode;
  value: number | string;
  /** Formats the (animated) value */
  format?: (value: number | string) => React.ReactNode;
  /** Number = percent; string shown as-is */
  delta?: number | string;
  /** Inferred from delta sign when omitted */
  trend?: 'up' | 'down' | 'neutral';
  /** e.g. "vs last month" */
  period?: React.ReactNode;
  previousValue?: number | string;
  icon?: React.ReactNode;
  variant?: 'outlined' | 'filled' | 'plain';
  /** Count up from 0 (ease-in-out, 1.2s). Later numeric value changes always ease from the old value (0.6s). */
  animate?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function StatCard(props: StatCardProps): JSX.Element;

import * as React from 'react';
/**
 * Pill filter row with mono counts. Active is ink-filled.
 * @startingPoint section="Data" subtitle="Pill filters with counts" viewport="700x140"
 */
export interface FilterTabsProps {
  items: Array<string | { value: string; label: React.ReactNode; count?: number; icon?: React.ReactNode; disabled?: boolean }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: 'sm' | 'md';
  showCounts?: boolean;
  style?: React.CSSProperties;
}
export declare function FilterTabs(props: FilterTabsProps): JSX.Element;

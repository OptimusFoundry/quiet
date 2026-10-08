import * as React from 'react';
/**
 * Mono caps tabs. Line (default), enclosed (rounded segmented control) or pill (ink-filled active).
 * @startingPoint section="Navigation" subtitle="Line, enclosed, pill" viewport="700x220"
 */
export interface TabsProps {
  /** `id` sets the tab's id; `panelId` links it to its tabpanel (aria-controls) */
  tabs: Array<string | { value: string; label?: React.ReactNode; icon?: React.ReactNode; count?: number; disabled?: boolean; id?: string; panelId?: string }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: 'line' | 'enclosed' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** Accessible name for the tablist */
  label?: string;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;

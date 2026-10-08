import * as React from 'react';
/**
 * Mono caps tabs. Line (default), enclosed (rounded segmented control) or pill (ink-filled active).
 * @startingPoint section="Navigation" subtitle="Line, enclosed, pill" viewport="700x220"
 */
export interface TabsProps {
  /** `id` sets the tab's id; `panelId` links it to its tabpanel (aria-controls). Both are generated when `panels` is set */
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
  /** The tablist's id; also the prefix of the generated tab and panel ids */
  id?: string;
  /**
   * Content per tab value (or a render function). Renders a wired tabpanel after the tablist for
   * every tab — role, id, aria-labelledby, aria-controls and `hidden` — instead of linking by `panelId`
   */
  panels?: Record<string, React.ReactNode> | ((value: string) => React.ReactNode);
  /** With `panels`: keep unselected panels' content mounted (hidden) instead of unmounting it */
  keepMounted?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;

/**
 * A tabpanel for layouts where the panel sits away from its Tabs: pass the ids you gave the tab
 * (`tabs[].id` → `tabId`, `tabs[].panelId` → `id`). Tabs with `panels` renders these for you.
 */
export interface TabPanelProps {
  id: string;
  /** id of the tab that labels this panel */
  tabId: string;
  hidden?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function TabPanel(props: TabPanelProps): JSX.Element;

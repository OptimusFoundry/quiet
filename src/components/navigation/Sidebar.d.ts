import * as React from 'react';
/**
 * App side navigation. Groups with mono labels, paper-2 active row, collapsible to a 64px rail, auto-collapse below a breakpoint.
 * @startingPoint section="Navigation" subtitle="App side navigation" viewport="900x560"
 */
export interface SidebarProps {
  items?: Array<{ label: React.ReactNode; value?: string; href?: string; icon?: React.ReactNode; badge?: React.ReactNode; /** Spoken text for the badge, e.g. "14 open" */ badgeLabel?: string; disabled?: boolean; active?: boolean; onClick?: () => void }>;
  /** Use instead of items for labelled sections. `collapsible` turns the label into a disclosure button (`defaultOpen` defaults to true) */
  groups?: Array<{ label?: React.ReactNode; items: Array<any>; collapsible?: boolean; defaultOpen?: boolean }>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Shows the ← / → toggle */
  collapsible?: boolean;
  compact?: boolean;
  dividers?: boolean;
  width?: number;
  collapsedWidth?: number;
  /** Auto-collapse below this viewport width (px) */
  breakpoint?: number;
  /** Accessible name for the nav landmark. Defaults to "Sidebar: <group labels>" or "Sidebar" */
  label?: string;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;

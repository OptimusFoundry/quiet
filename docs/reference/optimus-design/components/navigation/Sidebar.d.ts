import * as React from 'react';
/**
 * App side navigation. Groups with mono labels, paper-2 active row, collapsible to a 64px rail, auto-collapse below a breakpoint.
 * @startingPoint section="Navigation" subtitle="App side navigation" viewport="900x560"
 */
export interface SidebarProps {
  items?: Array<{ label: React.ReactNode; value?: string; href?: string; icon?: React.ReactNode; badge?: React.ReactNode; disabled?: boolean; active?: boolean; onClick?: () => void }>;
  /** Use instead of items for labelled sections */
  groups?: Array<{ label?: React.ReactNode; items: Array<any> }>;
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
  style?: React.CSSProperties;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;

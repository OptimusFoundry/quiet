import * as React from 'react';
/**
 * App side navigation. Groups with mono labels, paper-2 active row, collapsible to a 64px rail, auto-collapse below a breakpoint (or, in a SidebarProvider, an off-canvas drawer).
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
  /** Auto-collapse below this viewport width (px). Inside a SidebarProvider, the provider's `breakpoint` applies instead */
  breakpoint?: number;
  /** Below the breakpoint: collapse to the rail, or become an off-canvas drawer opened by a SidebarTrigger. Defaults to `drawer` inside a SidebarProvider, `rail` outside one */
  mobile?: 'rail' | 'drawer';
  /** Accessible name for the nav landmark. Defaults to "Sidebar: <group labels>" or "Sidebar" */
  label?: string;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Sidebar(props: SidebarProps): JSX.Element;

/** Shares the mobile drawer's state between a Sidebar and a SidebarTrigger placed anywhere (e.g. a top bar). */
export interface SidebarProviderProps {
  /** Below this viewport width (px) the Sidebar becomes a drawer. Default 768 */
  breakpoint?: number;
  /** Drawer open (controlled) */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}
export declare function SidebarProvider(props: SidebarProviderProps): JSX.Element;

/** Opens the mobile drawer. Renders only while the Sidebar is in drawer mode (below the breakpoint). */
export interface SidebarTriggerProps {
  /** Accessible name. Default "Open navigation" */
  'aria-label'?: string;
  /** Replaces the default ≡ glyph */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function SidebarTrigger(props: SidebarTriggerProps): JSX.Element | null;

export interface SidebarState {
  /** Viewport is below the breakpoint */
  isMobile: boolean;
  /** Mobile drawer is open */
  open: boolean;
  setOpen: (open: boolean) => void;
  close: () => void;
  /** Opens/closes the drawer on mobile; collapses/expands the rail on desktop */
  toggle: () => void;
  /** Desktop rail is collapsed */
  collapsed: boolean;
}
/** Sidebar state, inside a SidebarProvider or a Sidebar's own header/footer. Throws elsewhere. */
export declare function useSidebar(): SidebarState;

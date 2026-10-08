import * as React from 'react';
/**
 * Dev overlay: 12 columns + 8px rhythm lines. Toggle with Ctrl/⌘+G.
 * @startingPoint section="Layout" subtitle="Grid + rhythm overlay" viewport="900x300"
 */
export interface GridOverlayProps {
  visible?: boolean;
  defaultVisible?: boolean;
  columns?: number;
  maxWidth?: string | number;
  gutter?: string | number;
  padding?: string | number;
  /** Ctrl/⌘+G toggles */
  hotkey?: boolean;
  /** 8px horizontal rhythm lines */
  rhythm?: boolean;
  /** px to skip on the left, e.g. the sidebar width */
  offsetLeft?: number;
  className?: string;
  style?: React.CSSProperties;
}
export declare function GridOverlay(props: GridOverlayProps): JSX.Element;

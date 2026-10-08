import * as React from 'react';
/**
 * Action menu: icons, shortcuts, checkbox items, group labels, header, caption, context-menu mode.
 * @startingPoint section="Overlays" subtitle="Action & context menus" viewport="600x440"
 */
export interface DropdownMenuProps {
  /** Clickable element that opens the menu */
  trigger?: React.ReactNode;
  items: Array<{ label: React.ReactNode; sublabel?: React.ReactNode; icon?: React.ReactNode; shortcut?: string; onSelect?: (item: any) => void; disabled?: boolean; danger?: boolean; checked?: boolean; active?: boolean } | { divider: true } | { group: React.ReactNode }>;
  /** e.g. account name + email */
  header?: React.ReactNode;
  /** Mono footer line */
  caption?: React.ReactNode;
  size?: 'sm' | 'md';
  align?: 'start' | 'end';
  width?: number;
  /** Right-click children to open at the pointer */
  contextMenu?: boolean;
  children?: React.ReactNode;
  onSelect?: (item: any) => void;
  style?: React.CSSProperties;
}
export declare function DropdownMenu(props: DropdownMenuProps): JSX.Element;

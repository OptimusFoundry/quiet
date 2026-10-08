import * as React from 'react';
/**
 * ⌘K palette. Filter-as-you-type, grouped results, full keyboard control.
 * @startingPoint section="Navigation" subtitle="⌘K command palette" viewport="900x600"
 */
export interface CommandPaletteProps {
  open: boolean;
  onClose?: () => void;
  /** Called on ⌘K / Ctrl+K when hotkey is on */
  onOpen?: () => void;
  items: Array<{ id?: string; label: string; description?: string; group?: string; icon?: React.ReactNode; shortcut?: string; onSelect?: (item: any) => void }>;
  placeholder?: string;
  emptyText?: React.ReactNode;
  hotkey?: boolean;
  /** Accessible name for the dialog */
  label?: string;
}
export declare function CommandPalette(props: CommandPaletteProps): JSX.Element;

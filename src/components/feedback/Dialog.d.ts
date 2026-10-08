import * as React from 'react';
/**
 * Modal dialog. Rounded (--radius-xl), soft hairline, --shadow-3, ink scrim at 24%. Sizes, status icon, non-dismissible.
 * @startingPoint section="Overlays" subtitle="Modal dialogs" viewport="700x480"
 */
export interface DialogProps {
  open: boolean;
  onClose?: () => void;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  /** Italic phrase after the title; a molten period follows */
  accent?: React.ReactNode;
  /** 'info' | 'success' | 'warning' | 'error' or a glyph node — rendered in a 40px ring */
  icon?: 'info' | 'success' | 'warning' | 'error' | React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** px; overrides size */
  width?: number;
  /** false = no Esc, no scrim click, no × */
  dismissible?: boolean;
  showClose?: boolean;
}
export declare function Dialog(props: DialogProps): JSX.Element;

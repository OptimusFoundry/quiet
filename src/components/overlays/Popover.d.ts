import * as React from 'react';
/**
 * Click-triggered floating panel for rich content. Rounded (--radius-lg), soft hairline + shadow.
 * @startingPoint section="Overlays" subtitle="Floating panels" viewport="600x360"
 */
export interface PopoverProps {
  trigger: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: number;
  /** Focus first focusable element on open */
  trapFocus?: boolean;
  /** Close on a pointer down outside the trigger and panel (default true) */
  closeOnClickOutside?: boolean;
  /** Close on Escape and return focus to the trigger (default true) */
  closeOnEscape?: boolean;
  /** Show a × button in the panel's corner (default false) */
  showClose?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Popover(props: PopoverProps): JSX.Element;

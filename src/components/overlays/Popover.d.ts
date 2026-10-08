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
  className?: string;
  style?: React.CSSProperties;
}
export declare function Popover(props: PopoverProps): JSX.Element;

import * as React from 'react';
/**
 * Hold-to-confirm button for irreversible or wide-reaching actions. Pointer, Space or Enter must be
 * held for `duration`; a molten hairline fills along the bottom edge as you hold. Releasing early
 * springs back. Progress is exposed as a progressbar beside the button.
 * @startingPoint section="Future" subtitle="Hold to confirm" viewport="600x140"
 */
export interface HoldButtonProps {
  children?: React.ReactNode;
  /** Fires once, when the hold completes */
  onConfirm?: () => void;
  /** How long to hold, in ms (default 900) */
  duration?: number;
  /** Controlled confirmed state; uncontrolled by default */
  confirmed?: boolean;
  /** Label once confirmed, e.g. "Paused · undo for 24h" */
  confirmedLabel?: React.ReactNode;
  /** Accessible hint announced with the button */
  hint?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}
export declare function HoldButton(props: HoldButtonProps): JSX.Element;

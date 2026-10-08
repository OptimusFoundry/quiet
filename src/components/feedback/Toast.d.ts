import * as React from 'react';
/**
 * Rounded notification with a soft hairline and shadow. Variants mark status with a dot or glyph.
 * @startingPoint section="Feedback" subtitle="Transient notifications" viewport="600x360"
 */
export interface ToastProps {
  title?: React.ReactNode;
  /** Body sentence */
  description?: React.ReactNode;
  /** Mono caps metadata line */
  meta?: React.ReactNode;
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'error';
  /** Legacy: live = molten dot, neutral = ink dot */
  status?: 'live' | 'neutral';
  action?: React.ReactNode;
  /** Omit to make it not closable */
  onClose?: () => void;
  /** ms before it closes itself (needs onClose); paused while hovered or focused */
  duration?: number;
  style?: React.CSSProperties;
}
export declare function Toast(props: ToastProps): JSX.Element;

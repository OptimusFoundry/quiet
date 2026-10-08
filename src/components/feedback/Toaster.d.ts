import * as React from 'react';
import type { ToastProps } from './Toast';
/**
 * Fixed, portalled stack for Toasts raised with `toast()`. Mount one near the app root; extra
 * Toasters stay inert, so toasts never render twice. The stack is a polite live region; error
 * toasts announce assertively (role="alert"), the rest are role="status".
 */
export interface ToasterProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  /** Default ms before a toast closes itself (paused while hovered or focused); 0 keeps it until dismissed */
  duration?: number;
  /** Most toasts shown at once; the oldest give way. 0 = no limit */
  max?: number;
  /** Accessible name of the notifications region */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Toaster(props: ToasterProps): JSX.Element;

export interface ToastOptions {
  /** Reuse an id to replace a toast in place */
  id?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  /** Semantic intent; `error` is announced assertively */
  status?: 'info' | 'success' | 'warning' | 'error';
  /** Toast's visual variant; wins over `status` */
  variant?: ToastProps['variant'];
  action?: React.ReactNode;
  /** ms before it closes itself; 0 or Infinity keeps it until dismissed. Defaults to the Toaster's */
  duration?: number;
  /** Called after the toast closes (× button or timeout) */
  onDismiss?: (id: string) => void;
}
export interface ToastFn {
  /** Shows a toast and returns its id. A string or element is shorthand for `{ title }`. */
  (options: ToastOptions | React.ReactNode): string;
  /** Removes one toast, or every toast when called without an id */
  dismiss(id?: string): void;
}
export declare const toast: ToastFn;

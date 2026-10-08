import * as React from 'react';
/**
 * Full-width page-level strip above the header or app content.
 * @startingPoint section="Feedback" subtitle="Page-level strips" viewport="900x320"
 */
export interface BannerProps {
  /** ink = one-line ink strip · paper = paper-2 · outline = ink hairlines on white */
  variant?: 'ink' | 'paper' | 'outline';
  status?: 'info' | 'success' | 'warning' | 'error';
  title?: React.ReactNode;
  children?: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Landmark name when there is no title; defaults to "Notice" */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Banner(props: BannerProps): JSX.Element;

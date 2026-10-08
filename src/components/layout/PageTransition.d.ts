import * as React from 'react';
/**
 * Re-plays a slow enter animation whenever transitionKey changes.
 * @startingPoint section="Layout" subtitle="View enter transitions" viewport="700x260"
 */
export interface PageTransitionProps {
  /** Change it to replay (route, tab value) */
  transitionKey: React.Key;
  variant?: 'fade' | 'slide' | 'slideUp' | 'scale';
  /** ms; default 400 */
  duration?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PageTransition(props: PageTransitionProps): JSX.Element;

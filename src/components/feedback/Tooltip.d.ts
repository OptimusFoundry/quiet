import * as React from 'react';
/**
 * Ink tooltip, mono caps, soft corners (--radius-sm). Four placements, optional delay.
 * @startingPoint section="Feedback" subtitle="Ink tooltips, 4 placements" viewport="600x200"
 */
export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** ms before showing */
  delay?: number;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;

import * as React from 'react';
/**
 * A dotted sphere turning slowly, for AI working states. Pair it with a short status label.
 * Dot colours come from --q-thinking-orb-dot (grey) and --q-thinking-orb-dot-accent (molten), so it
 * follows the theme. Reduced motion holds one still frame.
 * @startingPoint section="Future" subtitle="A working state that turns" viewport="600x240"
 */
export interface ThinkingOrbProps extends Omit<React.CanvasHTMLAttributes<HTMLCanvasElement>, 'width' | 'height'> {
  /** Rendered size in px */
  size?: number;
  dots?: number;
  /** Laps per --q-thinking-orb-dur (6s); 0 holds still */
  speed?: number;
  /** Share of dots drawn in the accent, 0 – 1 */
  accent?: number;
  /** 0 keeps back dots as bright as front ones */
  depthFade?: number;
  /** Accessible name; pass "" when a visible label beside it already says what is happening */
  label?: string;
  ref?: React.Ref<HTMLCanvasElement>;
}
export declare function ThinkingOrb(props: ThinkingOrbProps): JSX.Element;

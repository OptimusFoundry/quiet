import * as React from 'react';
/**
 * A button whose length is its expected wait. Pressing it turns the button itself into the
 * progress bar: it fills, counts down, and says "Done". Evolved from Button + progress bar.
 * @startingPoint section="Future" subtitle="Honest button" viewport="700x180"
 */
export interface HonestButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  /** Expected duration in seconds (e.g. the median of recent runs). Sets the length and the countdown. */
  expected?: number;
  /** Starts the work. Return a promise to finish when it settles; the fill holds short of full if it overruns. */
  onPress?: () => void | Promise<unknown>;
  children?: React.ReactNode;
  doneLabel?: React.ReactNode;
  /** How long "Done" shows before the button resets, in ms */
  doneFor?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function HonestButton(props: HonestButtonProps): JSX.Element;

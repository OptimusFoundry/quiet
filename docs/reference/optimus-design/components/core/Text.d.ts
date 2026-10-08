import * as React from 'react';
/**
 * Typography primitive — body sizes, weights, colors, mono labels, headings, truncation.
 * @startingPoint section="Type" subtitle="Sizes, weights, colors, clamps" viewport="700x320"
 */
export interface TextProps {
  as?: keyof JSX.IntrinsicElements;
  /** 1–4 shortcuts to the heading scale (for headlines with an italic accent + period, use Headline) */
  heading?: 1 | 2 | 3 | 4;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | number;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'default' | 'heading' | 'muted' | 'quiet' | 'primary' | 'success' | 'warning' | 'error' | 'inherit';
  /** JetBrains Mono 11px caps +0.08em */
  mono?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  transform?: 'uppercase' | 'lowercase' | 'capitalize';
  truncate?: boolean;
  lineClamp?: number;
  align?: 'left' | 'center' | 'right';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Text(props: TextProps): JSX.Element;

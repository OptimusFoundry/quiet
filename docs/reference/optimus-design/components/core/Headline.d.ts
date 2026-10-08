import * as React from 'react';
/**
 * Headline in Inter Tight: plain lead, one italic phrase, molten full stop.
 * @startingPoint section="Typography" subtitle="Headline with italic accent and molten period" viewport="700x320"
 */
export interface HeadlineProps {
  size?: 'display' | 'h2' | 'h3' | 'h4';
  /** Override the rendered tag */
  as?: keyof JSX.IntrinsicElements;
  /** Upright text before the accent */
  lead?: React.ReactNode;
  /** The single italic phrase */
  accent?: React.ReactNode;
  /** Upright text after the accent */
  after?: React.ReactNode;
  /** Append the molten full stop. Default true. */
  period?: boolean;
  /** Color the italic phrase molten (then drop other molten on the surface) */
  moltenAccent?: boolean;
  style?: React.CSSProperties;
}
export declare function Headline(props: HeadlineProps): JSX.Element;

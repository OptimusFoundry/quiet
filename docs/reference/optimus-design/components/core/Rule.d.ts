import * as React from 'react';
/**
 * 1px hairline divider (the Divider). Soft or ink; solid, dashed or dotted; optional mono label; horizontal or vertical.
 * @startingPoint section="Layout" subtitle="Hairlines — labelled, vertical, dashed" viewport="700x200"
 */
export interface RuleProps {
  tone?: 'soft' | 'ink';
  variant?: 'solid' | 'dashed' | 'dotted';
  orientation?: 'horizontal' | 'vertical';
  /** Mono caps label set into the line */
  label?: React.ReactNode;
  labelAlign?: 'center' | 'start';
  style?: React.CSSProperties;
}
export declare function Rule(props: RuleProps): JSX.Element;

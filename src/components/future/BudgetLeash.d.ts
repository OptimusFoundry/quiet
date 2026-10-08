import * as React from 'react';
/**
 * A spend limit on an agent drawn as a leash: the slack line from the agent to its cap sags while
 * there is room and pulls taut (and molten) as it spends. The agent slows before it stops. Read as
 * a meter; lengthen it with presets or "Give slack".
 * @startingPoint section="Future" subtitle="A spend cap that goes taut" viewport="640x200"
 */
export interface BudgetLeashProps {
  /** The run or agent, e.g. "Meerkat · research run" */
  label: string;
  /** Mark for the agent (e.g. an Avatar); decorative */
  agent?: React.ReactNode;
  spent: number;
  cap: number;
  onCapChange?: (cap: number) => void;
  /** Leash lengths to pick from */
  presets?: number[];
  /** Amount "Give slack" adds to the cap */
  slack?: number;
  slackLabel?: string;
  /** Share of the cap where it starts slowing (default 0.6) */
  slowAt?: number;
  /** Share of the cap where it crawls and the line goes taut (default 0.85) */
  crawlAt?: number;
  /** Words for full speed, slowing, crawling, stopped */
  speeds?: [string, string, string, string];
  /** What happens at the cap, e.g. "asks before spending more" */
  atCap?: string;
  /** Number → display string (default "$40", "$8.40") */
  format?: (value: number) => string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function BudgetLeash(props: BudgetLeashProps): JSX.Element;

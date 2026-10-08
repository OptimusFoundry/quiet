import * as React from 'react';
/**
 * An agent's run as named, timed, interruptible steps — replaces spinners and progress toasts for
 * work that touches real data. The last step is always a person; when the run reaches it, its
 * marker turns molten and `actions` appear. Controlled: the caller advances `current`.
 * @startingPoint section="Future" subtitle="Interruptible agent steps" viewport="760x360"
 */
export interface AgentRunStep {
  id?: string | number;
  /** What the step does, e.g. "Compute 7-day bounce rate" */
  label: React.ReactNode;
  /** Tool or source it uses (mono, right) */
  tool?: React.ReactNode;
  /** Elapsed time, shown once the step is done, e.g. "1.1s" */
  duration?: React.ReactNode;
}
export interface AgentRunProps {
  title: React.ReactNode;
  /** Mono line under the title, e.g. "Meerkat · started 4s ago" */
  meta?: React.ReactNode;
  /** The steps; the last one is the human handoff */
  steps: AgentRunStep[];
  /** Index of the step in progress */
  current?: number;
  status?: 'running' | 'paused' | 'stopped' | 'done';
  /** Each control renders only when its handler is given */
  onPause?: () => void;
  onResume?: () => void;
  onTakeOver?: () => void;
  onStop?: () => void;
  /** Shown when the run reaches the human step, e.g. Review / Discard buttons */
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
export declare function AgentRun(props: AgentRunProps): JSX.Element;

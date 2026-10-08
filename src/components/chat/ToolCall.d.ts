import * as React from 'react';
/**
 * A step Claude took inside a reply (a tool call or a thinking pass), folded to one line showing what
 * it was, its state and how long it took. Open it to see the input and output in mono.
 */
export interface ToolCallProps {
  /** Tool name, e.g. "web_search" */
  name?: string;
  /** "thinking" shows a hollow mark and the label "Thinking" */
  kind?: 'tool' | 'thinking';
  status?: 'running' | 'done' | 'error';
  /** Milliseconds, or a ready string ("1.2s") */
  duration?: number | string;
  /** One line after the name, e.g. the query */
  summary?: React.ReactNode;
  /** Strings print as-is; objects as JSON */
  input?: unknown;
  output?: unknown;
  /** Extra detail inside the open panel */
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}
export declare function ToolCall(props: ToolCallProps): JSX.Element;

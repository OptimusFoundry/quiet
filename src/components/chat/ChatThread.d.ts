import * as React from 'react';
/**
 * The scrolling conversation. It stays pinned to the newest message while you're at the bottom. If you
 * scroll up to read, it leaves you there and offers "Jump to latest" when something new arrives.
 * role="log" announces new turns politely. Give it a height, or let a flex/grid parent size it.
 */
export interface ChatThreadProps {
  /** ChatMessage and ChatDivider elements */
  children?: React.ReactNode;
  /** Shown when there are no messages, e.g. a greeting and PromptSuggestions */
  empty?: React.ReactNode;
  /** Accessible name of the log (default "Conversation") */
  label?: string;
  jumpLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function ChatThread(props: ChatThreadProps): JSX.Element;
/** A quiet day/date rule between turns: "Today", "Yesterday", "8 October". */
export declare function ChatDivider(props: { children?: React.ReactNode; className?: string; style?: React.CSSProperties }): JSX.Element;

import * as React from 'react';
import type { AttachmentProps } from './Attachment';
/**
 * One turn in a conversation. A person's message is a soft bubble on the right; Claude's reply is
 * plain prose under a small name row, with no bubble. While `status="streaming"` a soft caret trails
 * the text, and assistive tech hears "Claude is responding" once rather than every token.
 */
export interface ChatMessageProps {
  /** Who said it; pass the API message's `role` straight through */
  from?: 'user' | 'assistant' | 'system';
  /** Default "You" for user turns, "Claude" for replies */
  name?: string;
  /** Replaces the Claude mark in a reply's name row */
  avatar?: React.ReactNode;
  /** Rich content: paragraphs, ToolCall, CodeBlock … */
  children?: React.ReactNode;
  /** Shown as cards above the text */
  attachments?: (Omit<AttachmentProps, 'variant'> & { id?: string })[];
  status?: 'streaming' | 'done' | 'error';
  /** Shown when status is "error" */
  error?: React.ReactNode;
  /** Adds a Retry action */
  onRetry?: () => void;
  /** Adds an Edit action */
  onEdit?: () => void;
  /** Extra actions after Copy/Retry/Edit */
  actions?: React.ReactNode;
  /** What Copy puts on the clipboard (default: the rendered text) */
  copyText?: string;
  /** Default on for replies, off for user turns */
  showCopy?: boolean;
  time?: Date | string | number;
  className?: string;
  style?: React.CSSProperties;
}
export declare function ChatMessage(props: ChatMessageProps): JSX.Element;
/** The Claude mark: a molten asterisk on a quiet tile. */
export declare function ClaudeMark(props: { size?: 'sm' | 'md'; className?: string }): JSX.Element;

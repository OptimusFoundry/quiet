import * as React from 'react';
/** A file waiting in the composer, or sent with a message. */
export interface ChatAttachment {
  id: string;
  file?: File;
  name: string;
  size?: number;
  type?: string;
  src?: string;
  /** Upload progress 0–1 (or pass the composer's `progress` map) */
  progress?: number;
  status?: 'done' | 'uploading' | 'error';
  error?: React.ReactNode;
}
/**
 * The message box. Text grows with what you type up to `maxRows`. Enter sends, Shift+Enter adds a new
 * line, and nothing sends mid-IME-composition. Files arrive by the attach button, drag-and-drop, or
 * pasting an image, and sit above the text as removable chips. While `busy`, Send becomes Stop.
 * Sending is the product's job: `onSubmit({ text, attachments })`.
 */
export interface ChatComposerProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  attachments?: ChatAttachment[];
  defaultAttachments?: ChatAttachment[];
  onAttachmentsChange?: (attachments: ChatAttachment[]) => void;
  /** Called on Enter or Send; the composer then clears its text and attachments */
  onSubmit?: (message: { text: string; attachments: ChatAttachment[] }) => void;
  /** Called by the Stop button while `busy` */
  onStop?: () => void;
  /** A reply is streaming: Send becomes Stop and Enter doesn't send */
  busy?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Accessible name for the form and textarea (default "Message") */
  label?: string;
  /** File types, as for <input accept>: "image/*,.pdf,.csv" */
  accept?: string;
  /** Default 10 */
  maxFiles?: number;
  /** Bytes; larger files are refused and the refusal is announced */
  maxSize?: number;
  /** Text grows up to this many lines, then scrolls (default 10) */
  maxRows?: number;
  /** Upload progress by attachment id, 0–1 */
  progress?: Record<string, number>;
  /** Left of the toolbar: a model or tool picker */
  toolbar?: React.ReactNode;
  /** Right of the toolbar, before Send: a short mono hint */
  hint?: React.ReactNode;
  autoFocus?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function ChatComposer(props: ChatComposerProps): JSX.Element;

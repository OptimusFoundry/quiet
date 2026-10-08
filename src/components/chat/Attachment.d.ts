import * as React from 'react';
/**
 * A file in a conversation. `chip` sits in the composer and can be removed; `card` sits in a message
 * and can be opened. Images show a thumbnail (from `src`, or an object URL made from `file`).
 * Documents show their type ("PDF", "CSV") in a tile, with name and size.
 */
export interface AttachmentProps {
  /** The File itself; name, size, type and the image thumbnail are read from it */
  file?: File;
  name?: string;
  /** Bytes */
  size?: number;
  /** MIME type */
  type?: string;
  /** Thumbnail URL for images that aren't a local File */
  src?: string;
  variant?: 'chip' | 'card';
  status?: 'done' | 'uploading' | 'error';
  /** Upload progress 0–1; omit while uploading for an indeterminate bar */
  progress?: number;
  /** Shown in place of the size when status is "error" */
  error?: React.ReactNode;
  /** Chip: shows the remove button */
  onRemove?: () => void;
  /** Card: makes it a button */
  onOpen?: () => void;
  /** Card: makes it a link (opens in a new tab) */
  href?: string;
  /** Ref to the remove button, for focus management */
  removeRef?: React.Ref<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Attachment(props: AttachmentProps): JSX.Element;

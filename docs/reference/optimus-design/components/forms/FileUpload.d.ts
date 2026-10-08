import * as React from 'react';
/**
 * Dashed drop zone or button with a hairline file list. Type, size and count validation; optional simulated progress.
 * @startingPoint section="Forms" subtitle="Drop zone + file list" viewport="700x440"
 */
export interface FileUploadProps {
  label?: React.ReactNode;
  /** Mono hint; auto-generated from accept/maxSize/maxFiles when omitted */
  hint?: React.ReactNode;
  /** e.g. "image/*" or ".pdf,.docx" */
  accept?: string;
  multiple?: boolean;
  /** Bytes */
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  variant?: 'dropzone' | 'button';
  /** Preloaded rows: { name, size?, progress?, error? } */
  defaultFiles?: Array<{ name: string; size?: number; progress?: number; error?: string }>;
  onChange?: (files: Array<{ id: number; name: string; size?: number; file?: File; progress?: number; error?: string | null }>) => void;
  /** Demo only — animates progress for new files */
  simulateUpload?: boolean;
  buttonLabel?: string;
  style?: React.CSSProperties;
}
export declare function FileUpload(props: FileUploadProps): JSX.Element;

import * as React from 'react';
/**
 * Free text in; how the system read it comes back as editable chips before anything runs — the
 * chips are the form, filled in for you. Reading the text is the caller's job: set `status` to
 * "reading" while you work it out, then pass the interpretation as `chips` with `status="read"`.
 * @startingPoint section="Future" subtitle="Say it, then check how it was read" viewport="760x220"
 */
export interface IntentChip {
  key?: string;
  /** Mono key, e.g. "Action" */
  label: string;
  /** Current reading, e.g. "Pause" */
  value: string;
  /** Alternatives; with two or more the chip opens a menu to switch */
  options?: string[];
}
export interface IntentBarProps {
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  /** Enter or the Read button */
  onSubmit?: (text: string) => void;
  /** idle → reading (skeleton chips) → read (chips + footer) */
  status?: 'idle' | 'reading' | 'read';
  chips?: IntentChip[];
  /** A chip's option was picked */
  onChipChange?: (key: string | number, value: string) => void;
  /** What the reading matches, e.g. "Matches 3 campaigns" */
  summary?: React.ReactNode;
  /** Buttons that act on the reading (shown once read) */
  actions?: React.ReactNode;
  /** Example requests shown while idle; picking one fills the field */
  suggestions?: string[];
  placeholder?: string;
  /** Accessible name of the field (default "What do you want done?") */
  label?: string;
  submitLabel?: string;
  resubmitLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function IntentBar(props: IntentBarProps): JSX.Element;

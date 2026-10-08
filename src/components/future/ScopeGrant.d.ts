import * as React from 'react';
/**
 * Narrow, time-boxed permission for an agent, in plain words: a switch per scope, one duration,
 * and a footer that says what it can't do. Grant hands the set over; Revoke takes it all back.
 * @startingPoint section="Future" subtitle="What an agent may do, and for how long" viewport="680x420"
 */
export interface Scope {
  id: string;
  /** Plain words, e.g. "Publish to Bluesky, X, Threads" */
  label: React.ReactNode;
  /** Word used in the "can't …" footer (default: the label's first word, lowercased) */
  short?: string;
  /** Second line under the label */
  description?: React.ReactNode;
  /** When off, the agent asks first instead of being unable — shown as "Asks first" */
  asks?: boolean;
  /** On by default (uncontrolled) */
  defaultGranted?: boolean;
}
export interface ScopeGrantDuration {
  value: string;
  label: React.ReactNode;
  /** Footer phrase, e.g. "expires at midnight" */
  expires?: string;
}
export interface ScopeGrantProps {
  /**
   * Mark for the agent; decorative (the title carries the name). A string renders as a square
   * Avatar with its initials, e.g. `agent="Meerkat"`; pass a node for anything else.
   */
  agent?: React.ReactNode;
  title: React.ReactNode;
  /** Mono line under the title, e.g. "Scoped to this workspace" */
  caption?: React.ReactNode;
  scopes: Scope[];
  /** Granted scope ids */
  value?: string[];
  defaultValue?: string[];
  onChange?: (ids: string[]) => void;
  durations?: ScopeGrantDuration[];
  duration?: string;
  defaultDuration?: string;
  onDurationChange?: (value: string) => void;
  onGrant?: (grant: { scopes: string[]; duration?: string }) => void;
  /** Shown once `granted` */
  onRevoke?: () => void;
  /** The grant is live: Grant becomes Update, Revoke appears, the grant is announced */
  granted?: boolean;
  grantLabel?: string;
  revokeLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function ScopeGrant(props: ScopeGrantProps): JSX.Element;

import * as React from 'react';
/**
 * An inline mark on a claim the system isn't sure of. Hover or focus explains why; with
 * `onRecheck` the claim is the button that sends the system back to the data, which then
 * confirms it or rewrites it in place.
 * @startingPoint section="Future" subtitle="Claims that admit doubt" viewport="700x220"
 */
export interface DoubtMarkerProps {
  /** The claim as originally written */
  children: React.ReactNode;
  /** Why the system isn't sure, shown on hover and focus */
  reason?: React.ReactNode;
  /** doubt: unsure · checking: re-check in flight · confirmed: the data agreed · revised: rewritten */
  status?: 'doubt' | 'checking' | 'confirmed' | 'revised';
  /** The rewritten claim, shown in place when `status` is revised */
  revision?: React.ReactNode;
  /** How sure the system is, 0–1, shown while in doubt */
  confidence?: number;
  /** Makes the claim a button that asks for a re-check */
  onRecheck?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Verb for the re-check action (default "Re-check") */
  recheckLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function DoubtMarker(props: DoubtMarkerProps): JSX.Element;

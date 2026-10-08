import * as React from 'react';
/**
 * Inline, in-flow message box. Rounded (--radius-md), hairline; status reads through the ringed glyph.
 * @startingPoint section="Feedback" subtitle="Info · success · warning · error" viewport="700x420"
 */
export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** false hides it; node replaces it */
  icon?: false | React.ReactNode;
  /** e.g. an ArrowLink or small Button */
  action?: React.ReactNode;
  /** Shows × */
  onDismiss?: () => void;
  style?: React.CSSProperties;
}
export declare function Alert(props: AlertProps): JSX.Element;

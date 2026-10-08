import * as React from 'react';
/**
 * Rounded hairline container (--radius-lg). When interactive, hover lifts to --shadow-2 and the border goes --rule-strong.
 * @startingPoint section="Display" subtitle="Hairline work card" viewport="700x320"
 */
export interface CardProps {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  /** Italic phrase after the title, e.g. "iOS" in "Anvil iOS" */
  accent?: React.ReactNode;
  children?: React.ReactNode;
  /** Mono metadata in the footer row */
  meta?: React.ReactNode;
  /** Right side of footer row (e.g. an arrow) */
  footer?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;

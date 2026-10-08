import * as React from 'react';
/**
 * Site header: wordmark, text links, ink pill CTA, soft hairline below.
 * @startingPoint section="Navigation" subtitle="Site header" viewport="1100x120"
 */
export interface NavBarProps {
  /** `current` marks the link for the page you are on (aria-current="page") */
  links?: Array<{ label: string; href: string; current?: boolean }>;
  cta?: React.ReactNode;
  ctaHref?: string;
  onCta?: () => void;
  /** Optional mark element (28px) shown left of the wordmark */
  mark?: React.ReactNode;
  /** Accessible name for the nav landmark */
  label?: string;
  /** Accessible name for the wordmark home link (defaults to the wordmark text) */
  homeLabel?: string;
  style?: React.CSSProperties;
}
export declare function NavBar(props: NavBarProps): JSX.Element;

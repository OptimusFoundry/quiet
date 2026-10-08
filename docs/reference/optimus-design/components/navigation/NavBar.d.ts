import * as React from 'react';
/**
 * Site header: wordmark, text links, ink pill CTA, soft hairline below.
 * @startingPoint section="Navigation" subtitle="Site header" viewport="1100x120"
 */
export interface NavBarProps {
  links?: Array<{ label: string; href: string }>;
  cta?: React.ReactNode;
  ctaHref?: string;
  onCta?: () => void;
  /** Optional mark element (28px) shown left of the wordmark */
  mark?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function NavBar(props: NavBarProps): JSX.Element;

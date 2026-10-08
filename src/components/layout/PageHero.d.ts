import * as React from 'react';
/**
 * Top-of-page title block: eyebrow, headline with italic accent and molten period, intro, actions.
 * @startingPoint section="Layout" subtitle="Page title blocks" viewport="900x360"
 */
export interface PageHeroProps {
  /** Ink serial before the eyebrow, e.g. "02" */
  index?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  accent?: React.ReactNode;
  after?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** lg = marketing/section pages · md = app pages */
  size?: 'lg' | 'md';
  /** Soft rule under the hero */
  ruled?: boolean;
  /** Heading level of the title; default h1 */
  as?: 'h1' | 'h2' | 'h3';
  style?: React.CSSProperties;
}
export declare function PageHero(props: PageHeroProps): JSX.Element;

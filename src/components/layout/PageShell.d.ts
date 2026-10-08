import * as React from 'react';
/**
 * Page frame: max width, gutters, header slot, and a 1 / 2 / 3 / sidebar column layout that stacks under 720px.
 * @startingPoint section="Layout" subtitle="Page column layouts" viewport="900x420"
 */
export interface PageShellProps {
  layout?: 'single' | 'half' | 'third' | 'sidebar' | 'sidebar-right';
  /** 880px max instead of 1280 */
  narrow?: boolean;
  /** Usually a PageHero */
  header?: React.ReactNode;
  /** One child per column */
  children?: React.ReactNode;
  gap?: number;
  animated?: boolean;
  /** Root element; pass 'main' when the shell is the page's main landmark */
  as?: 'div' | 'main' | 'section' | 'article';
  className?: string;
  style?: React.CSSProperties;
}
export declare function PageShell(props: PageShellProps): JSX.Element;

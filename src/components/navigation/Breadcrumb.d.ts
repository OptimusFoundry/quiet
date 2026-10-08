import * as React from 'react';
/**
 * Mono caps trail separated by /. Collapses the middle into … .
 * @startingPoint section="Navigation" subtitle="Mono path trail" viewport="700x160"
 */
export interface BreadcrumbProps {
  items: Array<{ label: React.ReactNode; href?: string; onClick?: () => void; icon?: React.ReactNode }>;
  separator?: React.ReactNode;
  /** Collapse to first + … + last (maxItems-1) */
  maxItems?: number;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible name for the nav landmark. Defaults to "Breadcrumb: <current page>" */
  label?: string;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;

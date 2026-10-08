import * as React from 'react';
/**
 * Page navigation with mono, zero-padded numbers in circles.
 * @startingPoint section="Navigation" subtitle="Page controls" viewport="700x180"
 */
export interface PaginationProps {
  page?: number;
  defaultPage?: number;
  /** Total pages */
  total: number;
  onChange?: (page: number) => void;
  siblings?: number;
  showFirstLast?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Accessible name for the nav landmark. Defaults to "Pagination, page <n> of <total>" */
  label?: string;
  'aria-label'?: string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Pagination(props: PaginationProps): JSX.Element;

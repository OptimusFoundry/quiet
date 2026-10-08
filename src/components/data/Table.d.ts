import * as React from 'react';
/**
 * Data table. Mono caps header on an ink rule, soft row hairlines. Sorting, selection, expandable rows, striped, bordered, loading.
 * @startingPoint section="Data" subtitle="Sortable, selectable table" viewport="900x420"
 */
export interface TableProps {
  columns: Array<{
    key: string; header: React.ReactNode; align?: 'left' | 'right' | 'center'; width?: number | string; sortable?: boolean; sortValue?: (row: any) => any; nowrap?: boolean;
    render?: (row: any, index: number) => React.ReactNode;
    /** Cell spans this many columns for the row; the columns it covers are not rendered */
    colSpan?: (row: any, index: number) => number | undefined;
    /** Footer (totals) cell; a function receives the rows in display order */
    footer?: React.ReactNode | ((rows: any[]) => React.ReactNode);
    /** Footer cell spans this many columns */
    footerColSpan?: number;
  }>;
  data: any[];
  /** Field name or getter; default 'id' */
  rowKey?: string | ((row: any) => any);
  size?: 'sm' | 'md' | 'lg';
  striped?: boolean;
  bordered?: boolean;
  caption?: React.ReactNode;
  selectable?: boolean;
  selected?: any[];
  defaultSelected?: any[];
  onSelectionChange?: (keys: any[]) => void;
  sort?: { key: string; dir: 'asc' | 'desc' } | null;
  defaultSort?: { key: string; dir: 'asc' | 'desc' };
  onSortChange?: (sort: { key: string; dir: 'asc' | 'desc' } | null) => void;
  /** Don't sort client-side; just report */
  manualSort?: boolean;
  /** Enables expandable rows */
  renderExpanded?: (row: any) => React.ReactNode;
  /** Expanded row keys (controlled) */
  expanded?: any[];
  defaultExpanded?: any[];
  onExpandedChange?: (keys: any[]) => void;
  /** Full-width footer row, after any columns[].footer row */
  footer?: React.ReactNode;
  loading?: boolean;
  loadingRows?: number;
  emptyText?: React.ReactNode;
  onRowClick?: (row: any) => void;
  /** Scroll horizontally below this width */
  minWidth?: number;
  /** Accessible name when there is no caption */
  label?: string;
  /** Row name used in 'Select …' / 'Expand …' labels; default: first column's value */
  rowLabel?: (row: any) => string;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Table(props: TableProps): JSX.Element;

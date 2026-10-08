import * as React from 'react';
/**
 * Data table. Mono caps header on an ink rule, soft row hairlines. Sorting, selection, expandable rows, striped, bordered, loading.
 * @startingPoint section="Data" subtitle="Sortable, selectable table" viewport="900x420"
 */
export interface TableProps {
  columns: Array<{ key: string; header: React.ReactNode; align?: 'left' | 'right' | 'center'; width?: number | string; sortable?: boolean; sortValue?: (row: any) => any; nowrap?: boolean; render?: (row: any, index: number) => React.ReactNode }>;
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
  loading?: boolean;
  loadingRows?: number;
  emptyText?: React.ReactNode;
  onRowClick?: (row: any) => void;
  /** Scroll horizontally below this width */
  minWidth?: number;
  style?: React.CSSProperties;
}
export declare function Table(props: TableProps): JSX.Element;

import * as React from 'react';
/**
 * Table + title bar, filter box, pagination, selection count, loading and empty states.
 * @startingPoint section="Data" subtitle="Table with toolbar & pages" viewport="900x520"
 */
export interface DataGridProps {
  columns: Array<any>;
  data: any[];
  rowKey?: string | ((row: any) => any);
  title?: React.ReactNode;
  actions?: React.ReactNode;
  /** Client-side contains-filter across column fields */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** 0 disables paging */
  pageSize?: number;
  selectable?: boolean;
  onSelectionChange?: (keys: any[]) => void;
  onRowClick?: (row: any) => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyActions?: React.ReactNode;
  style?: React.CSSProperties;
  /** Any other Table prop (striped, bordered, defaultSort, renderExpanded…) */
  [key: string]: any;
}
export declare function DataGrid(props: DataGridProps): JSX.Element;

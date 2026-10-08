import React from 'react';
import { Table } from './Table';
import { Pagination } from '../navigation/Pagination';
import { EmptyState } from './EmptyState';

export function DataGrid({ columns = [], data = [], rowKey = 'id', title, actions, searchable = false, searchPlaceholder = 'Filter rows', pageSize = 10, selectable = false, onSelectionChange,
  onRowClick, loading = false, size = 'md', emptyTitle = 'Nothing here', emptyDescription, emptyActions, style, ...tableProps }) {
  const [q, setQ] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [sel, setSel] = React.useState([]);
  const filtered = React.useMemo(() => !q ? data : data.filter(r => columns.some(c => String(r[c.key] ?? '').toLowerCase().includes(q.toLowerCase()))), [data, q, columns]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, pages);
  const slice = pageSize ? filtered.slice((cur - 1) * pageSize, cur * pageSize) : filtered;
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' };
  const empty = !loading && filtered.length === 0;
  const name = typeof title === 'string' ? title : 'Table';
  const status = [loading ? '' : filtered.length ? 'Showing ' + ((cur - 1) * pageSize + 1) + '\u2013' + (pageSize ? Math.min(cur * pageSize, filtered.length) : filtered.length) + ' of ' + filtered.length + (q ? ' matching rows' : ' rows') : q ? 'No rows match' : '',
    selectable && sel.length ? sel.length + ' selected' : ''].filter(Boolean).join(', ');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, ...style }}>
      {(title || actions || searchable) && <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {title && <div style={{ fontWeight: 600, fontSize: 19, letterSpacing: '-0.015em', color: 'var(--ink)', marginRight: 'auto' }}>{title}</div>}
        {searchable && <input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder={searchPlaceholder} aria-label={typeof title === 'string' ? searchPlaceholder + ' in ' + title : searchPlaceholder}
          style={{ height: 36, minWidth: 220, padding: '0 12px', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-pill)', outline: 'none', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--ink)', marginLeft: title ? 0 : undefined }} />}
        {actions}
      </div>}
      <span className="q-sr-only" role="status">{status}</span>
      {selectable && sel.length > 0 && <div style={{ ...mono, color: 'var(--ink)' }}>{sel.length} selected</div>}
      {empty ? <div style={{ borderTop: '1px solid var(--ink)' }}><EmptyState size="sm" icon={q ? '?' : '/'} title={q ? 'Nothing matches' : emptyTitle} description={q ? 'No row contains \u201c' + q + '\u201d.' : emptyDescription} actions={q ? null : emptyActions} /></div>
        : <Table label={typeof title === 'string' ? title : undefined} columns={columns} data={slice} rowKey={rowKey} size={size} loading={loading} loadingRows={Math.min(pageSize, 5)} selectable={selectable}
            selected={sel} onSelectionChange={s => { setSel(s); onSelectionChange && onSelectionChange(s); }} onRowClick={onRowClick} {...tableProps} />}
      {!empty && !loading && pageSize && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <span style={mono}>{(cur - 1) * pageSize + 1}{'\u2013'}{Math.min(cur * pageSize, filtered.length)} of {filtered.length}</span>
        {pages > 1 && <Pagination aria-label={name + ' pages'} total={pages} page={cur} onChange={setPage} size="sm" showFirstLast={pages > 5} />}
      </div>}
    </div>
  );
}

import React from 'react';
import { motionToken, usePresence } from '../../a11y/hooks';
import './Table.scss';

const SIZES = ['sm', 'md', 'lg'];
const len = v => typeof v === 'number' ? v + 'px' : v;
// Per-column width and alignment are dynamic, so they travel as --_* custom properties.
const colVars = c => {
  const v = {};
  if (c.width != null) v['--_width'] = len(c.width);
  if (c.align) v['--_align'] = c.align;
  return v;
};

// Columns covered by an earlier cell's colSpan are dropped, so every row keeps the column count.
const spans = (cols, spanOf) => {
  const out = [];
  for (let ci = 0; ci < cols.length;) {
    const c = cols[ci];
    const n = Math.max(1, Math.min(Math.floor(spanOf(c) || 1), cols.length - ci));
    out.push({ c, ci, span: n > 1 ? n : undefined });
    ci += n;
  }
  return out;
};

function Box({ on, mixed, onClick, label }) {
  return <span role="checkbox" aria-checked={mixed ? 'mixed' : on} aria-label={label} tabIndex={0} onClick={e => { e.stopPropagation(); onClick(); }} onKeyDown={e => e.key === ' ' && (e.preventDefault(), onClick())}
    className="q-table__check">{mixed ? '\u2212' : on ? '\u2713' : ''}</span>;
}

function TR({ row, cols, i, striped, selectable, isSel, onSel, expandable, isOpen, onOpen, onRowClick, renderExpanded, name, id }) {
  const click = onRowClick ? () => onRowClick(row) : expandable ? onOpen : undefined;
  const reveal = usePresence(expandable && isOpen);
  const cls = ['q-table__row', click && 'q-table__row--clickable', striped && i % 2 && 'q-table__row--stripe'].filter(Boolean).join(' ');
  return (
    <>
      <tr onClick={click} aria-selected={selectable ? isSel : undefined} className={cls}
        tabIndex={onRowClick ? 0 : undefined} onKeyDown={onRowClick ? e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onRowClick(row); } } : undefined}>
        {selectable && <td className="q-table__cell q-table__cell--control"><Box on={isSel} onClick={onSel} label={'Select ' + name} /></td>}
        {expandable && <td className="q-table__cell q-table__cell--control"><button type="button" aria-label={(isOpen ? 'Collapse ' : 'Expand ') + name} aria-expanded={isOpen} aria-controls={id} onClick={e => { e.stopPropagation(); onOpen(); }}
          className="q-table__expand">+</button></td>}
        {spans(cols, c => c.colSpan && c.colSpan(row, i)).map(({ c, ci, span }) => <td key={c.key} colSpan={span} style={colVars(c)}
          className={['q-table__cell', ci === 0 && 'q-table__cell--first', c.nowrap && 'q-table__cell--nowrap', c.align === 'right' && 'q-table__cell--numeric'].filter(Boolean).join(' ')}>
          {c.render ? c.render(row, i) : row[c.key]}</td>)}
      </tr>
      {reveal.mounted && <tr id={id} className="q-anim-drop" data-state={reveal.state}><td colSpan={cols.length + 1 + (selectable ? 1 : 0)} className="q-table__detail">{renderExpanded(row)}</td></tr>}
    </>
  );
}

export function Table({ columns = [], data = [], rowKey = 'id', size = 'md', striped = false, bordered = false, caption, selectable = false, selected, defaultSelected = [], onSelectionChange,
  sort, defaultSort, onSortChange, manualSort = false, renderExpanded, expanded, defaultExpanded = [], onExpandedChange, footer, loading = false, loadingRows = 5, emptyText = 'No rows.', onRowClick, minWidth, label, rowLabel, className, style }) {
  const [innerSel, setInnerSel] = React.useState(defaultSelected);
  const [innerSort, setInnerSort] = React.useState(defaultSort || null);
  const [innerOpen, setInnerOpen] = React.useState(defaultExpanded);
  const sel = selected ?? innerSel;
  const open = expanded ?? innerOpen;
  const toggleOpen = k => { const next = open.includes(k) ? open.filter(x => x !== k) : [...open, k]; setInnerOpen(next); onExpandedChange && onExpandedChange(next); };
  const srt = sort !== undefined ? sort : innerSort;
  const keyOf = (r, i) => typeof rowKey === 'function' ? rowKey(r) : r[rowKey] ?? i;
  const setSel = s => { setInnerSel(s); onSelectionChange && onSelectionChange(s); };
  const rows = React.useMemo(() => {
    if (!srt || manualSort) return data;
    const col = columns.find(c => c.key === srt.key);
    const get = col && col.sortValue ? col.sortValue : r => r[srt.key];
    return [...data].sort((a, b) => { const x = get(a), y = get(b); const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y)); return srt.dir === 'desc' ? -r : r; });
  }, [data, srt, manualSort, columns]);
  const keys = rows.map(keyOf);
  const all = keys.length > 0 && keys.every(k => sel.includes(k));
  const some = !all && keys.some(k => sel.includes(k));
  const clickSort = c => { const next = !srt || srt.key !== c.key ? { key: c.key, dir: 'asc' } : srt.dir === 'asc' ? { key: c.key, dir: 'desc' } : null; setInnerSort(next); onSortChange && onSortChange(next); };
  const extra = (selectable ? 1 : 0) + (renderExpanded ? 1 : 0);
  const hasColFooter = columns.some(c => c.footer !== undefined);
  const uid = React.useId();
  const nameOf = (r, k) => rowLabel ? rowLabel(r) : columns[0] && (typeof r[columns[0].key] === 'string' || typeof r[columns[0].key] === 'number') ? String(r[columns[0].key]) : 'row ' + k;
  // Sort reorder: rows fade in softly after the order changes (never on mount).
  const body = React.useRef(null);
  const sortSig = srt ? srt.key + ':' + srt.dir : '';
  const lastSig = React.useRef(sortSig);
  React.useEffect(() => {
    if (lastSig.current === sortSig) return;
    lastSig.current = sortSig;
    const el = body.current;
    if (!el || !el.animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timing = { duration: motionToken(el, '--q-dur-expand'), easing: motionToken(el, '--q-ease-soft') };
    el.querySelectorAll('tr').forEach(tr => tr.animate([{ opacity: 0.35 }, { opacity: 1 }], timing));
  }, [sortSig]);
  const cls = ['q-table', 'q-table--' + (SIZES.includes(size) ? size : 'md'), bordered && 'q-table--bordered', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      <table aria-label={caption ? undefined : label} aria-busy={loading || undefined} className="q-table__table" style={minWidth != null ? { '--_min-width': len(minWidth) } : undefined}>
        {caption && <caption className="q-table__caption">{caption}</caption>}
        <thead><tr>
          {selectable && <th className="q-table__head q-table__head--control"><Box on={all} mixed={some} onClick={() => setSel(all ? sel.filter(k => !keys.includes(k)) : Array.from(new Set([...sel, ...keys])))} label="Select all rows" /></th>}
          {renderExpanded && <th className="q-table__head q-table__head--control"><span className="q-sr-only">Details</span></th>}
          {columns.map(c => {
            const on = srt && srt.key === c.key;
            return (
              <th key={c.key} aria-sort={on ? (srt.dir === 'asc' ? 'ascending' : 'descending') : undefined} className="q-table__head" style={colVars(c)}>
                {c.sortable ? <button type="button" onClick={() => clickSort(c)} className="q-table__sort">
                  {c.header}<span aria-hidden="true">{on ? (srt.dir === 'asc' ? '\u2191' : '\u2193') : '\u2195'}</span></button> : c.header}
              </th>
            );
          })}
        </tr></thead>
        <tbody ref={body}>
          {loading ? Array.from({ length: loadingRows }, (_, i) => (
            <tr key={'s' + i}>{Array.from({ length: columns.length + extra }, (_, j) => <td key={j} className="q-table__skeleton-cell"><span className={'q-table__skeleton' + (j === 0 ? ' q-table__skeleton--first' : '')} /></td>)}</tr>
          )) : rows.length === 0 ? (
            <tr><td colSpan={columns.length + extra} className="q-table__empty">{emptyText}</td></tr>
          ) : rows.map((r, i) => { const k = keyOf(r, i); return (
            <TR key={k} row={r} cols={columns} i={i} striped={striped} selectable={selectable} isSel={sel.includes(k)}
              onSel={() => setSel(sel.includes(k) ? sel.filter(x => x !== k) : [...sel, k])} expandable={!!renderExpanded} isOpen={open.includes(k)}
              onOpen={() => toggleOpen(k)} onRowClick={onRowClick} renderExpanded={renderExpanded} name={nameOf(r, k)} id={uid + 'x' + i} />
          ); })}
        </tbody>
        {!loading && (hasColFooter || footer != null) && <tfoot>
          {hasColFooter && <tr>
            {Array.from({ length: extra }, (_, j) => <td key={'c' + j} className="q-table__foot q-table__foot--control" />)}
            {spans(columns, c => c.footerColSpan).map(({ c, span }) => <td key={c.key} colSpan={span} style={colVars(c)}
              className={['q-table__foot', c.nowrap && 'q-table__foot--nowrap', c.align === 'right' && 'q-table__foot--numeric'].filter(Boolean).join(' ')}>
              {typeof c.footer === 'function' ? c.footer(rows) : c.footer}</td>)}
          </tr>}
          {footer != null && <tr><td colSpan={columns.length + extra} className="q-table__foot">{footer}</td></tr>}
        </tfoot>}
      </table>
    </div>
  );
}

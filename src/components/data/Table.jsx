import React from 'react';
import { usePresence } from '../../a11y/hooks';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-pulse')) {
  const s = document.createElement('style'); s.id = 'of-kf-pulse';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-pulse{0%,100%{opacity:1}50%{opacity:.45}}}';
  document.head.appendChild(s);
}
const SIZES = { sm: { p: '8px 12px', fs: 13 }, md: { p: '14px 16px', fs: 15 }, lg: { p: '20px 20px', fs: 15 } };

function Box({ on, mixed, onClick, label }) {
  return <span role="checkbox" aria-checked={mixed ? 'mixed' : on} aria-label={label} tabIndex={0} onClick={e => { e.stopPropagation(); onClick(); }} onKeyDown={e => e.key === ' ' && (e.preventDefault(), onClick())}
    style={{ width: 16, height: 16, display: 'inline-grid', placeItems: 'center', boxSizing: 'border-box', borderRadius: 4, border: '1px solid var(--ink)', background: on || mixed ? 'var(--ink)' : 'var(--paper)', color: 'var(--paper)', fontSize: 11, lineHeight: 1, cursor: 'pointer', verticalAlign: 'middle', transition: 'background var(--dur-hover) var(--ease-soft)' }}>{mixed ? '\u2212' : on ? '\u2713' : ''}</span>;
}

function TR({ row, cols, sz, i, striped, bordered, selectable, isSel, onSel, expandable, isOpen, onOpen, onRowClick, renderExpanded, name, id }) {
  const [h, setH] = React.useState(false);
  const click = onRowClick ? () => onRowClick(row) : expandable ? onOpen : undefined;
  const reveal = usePresence(expandable && isOpen);
  const cell = { padding: sz.p, borderTop: '1px solid var(--rule-soft)', ...(bordered ? { borderLeft: '1px solid var(--rule-soft)' } : {}) };
  const bg = isSel ? 'var(--paper-2)' : click && h ? 'var(--paper-2)' : striped && i % 2 ? 'var(--paper-2)' : 'transparent';
  return (
    <>
      <tr onClick={click} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} aria-selected={selectable ? isSel : undefined}
        tabIndex={onRowClick ? 0 : undefined} onKeyDown={onRowClick ? e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onRowClick(row); } } : undefined}
        onFocus={onRowClick ? e => e.target === e.currentTarget && e.target.matches(':focus-visible') && setH(true) : undefined} onBlur={onRowClick ? () => setH(false) : undefined}
        style={{ background: bg, cursor: click ? 'pointer' : 'default', transition: 'background var(--dur-enter) var(--ease-soft)' }}>
        {selectable && <td style={{ ...cell, width: 16, borderLeft: 0 }}><Box on={isSel} onClick={onSel} label={'Select ' + name} /></td>}
        {expandable && <td style={{ ...cell, width: 16, borderLeft: selectable && bordered ? cell.borderLeft : 0 }}><button type="button" aria-label={(isOpen ? 'Collapse ' : 'Expand ') + name} aria-expanded={isOpen} aria-controls={id} onClick={e => { e.stopPropagation(); onOpen(); }}
          style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', fontSize: 15, color: 'var(--ink)', transition: 'transform var(--dur-expand) var(--ease-soft)', transform: isOpen ? 'rotate(45deg)' : 'none' }}>+</button></td>}
        {cols.map((c, ci) => <td key={c.key} style={{ ...cell, textAlign: c.align || 'left', width: c.width, whiteSpace: c.nowrap ? 'nowrap' : undefined, color: ci === 0 ? 'var(--ink)' : 'var(--ink-2)', fontVariantNumeric: c.align === 'right' ? 'tabular-nums' : undefined, ...(ci === 0 && !selectable && !expandable ? { borderLeft: 0 } : {}) }}>
          {c.render ? c.render(row, i) : row[c.key]}</td>)}
      </tr>
      {reveal.mounted && <tr id={id} className="q-anim-drop" data-state={reveal.state}><td colSpan={cols.length + 1 + (selectable ? 1 : 0)} style={{ padding: '16px ' + sz.p.split(' ')[1] + ' 24px', background: 'var(--paper-2)', borderTop: '1px solid var(--rule-soft)', fontSize: 15, color: 'var(--ink-2)' }}>{renderExpanded(row)}</td></tr>}
    </>
  );
}

export function Table({ columns = [], data = [], rowKey = 'id', size = 'md', striped = false, bordered = false, caption, selectable = false, selected, defaultSelected = [], onSelectionChange,
  sort, defaultSort, onSortChange, manualSort = false, renderExpanded, loading = false, loadingRows = 5, emptyText = 'No rows.', onRowClick, minWidth, label, rowLabel, style }) {
  const [innerSel, setInnerSel] = React.useState(defaultSelected);
  const [innerSort, setInnerSort] = React.useState(defaultSort || null);
  const [open, setOpen] = React.useState([]);
  const sel = selected ?? innerSel;
  const srt = sort !== undefined ? sort : innerSort;
  const sz = SIZES[size] || SIZES.md;
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
  const th = { padding: sz.p, fontFamily: 'var(--font-mono)', fontSize: size === 'sm' ? 10 : 11, fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', borderBottom: '1px solid var(--ink)', whiteSpace: 'nowrap', ...(bordered ? { borderLeft: '1px solid var(--rule-soft)' } : {}) };
  const extra = (selectable ? 1 : 0) + (renderExpanded ? 1 : 0);
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
    const ease = getComputedStyle(el).getPropertyValue('--ease-soft').trim() || 'ease';
    el.querySelectorAll('tr').forEach(tr => tr.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 280, easing: ease }));
  }, [sortSig]);
  return (
    <div style={{ overflowX: 'auto', ...(bordered ? { border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)' } : {}), ...style }}>
      <table aria-label={caption ? undefined : label} aria-busy={loading || undefined} style={{ width: '100%', minWidth, borderCollapse: 'collapse', fontSize: sz.fs, lineHeight: 1.45 }}>
        {caption && <caption style={{ captionSide: 'top', textAlign: 'left', padding: '0 0 12px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{caption}</caption>}
        <thead><tr>
          {selectable && <th style={{ ...th, width: 16, borderLeft: 0 }}><Box on={all} mixed={some} onClick={() => setSel(all ? sel.filter(k => !keys.includes(k)) : Array.from(new Set([...sel, ...keys])))} label="Select all rows" /></th>}
          {renderExpanded && <th style={{ ...th, width: 16, borderLeft: selectable && bordered ? th.borderLeft : 0 }}><span className="q-sr-only">Details</span></th>}
          {columns.map((c, ci) => {
            const on = srt && srt.key === c.key;
            return (
              <th key={c.key} aria-sort={on ? (srt.dir === 'asc' ? 'ascending' : 'descending') : undefined} style={{ ...th, textAlign: c.align || 'left', width: c.width, ...(ci === 0 && !extra ? { borderLeft: 0 } : {}) }}>
                {c.sortable ? <button type="button" onClick={() => clickSort(c)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: on ? 'var(--ink)' : 'inherit' }}>
                  {c.header}<span aria-hidden="true">{on ? (srt.dir === 'asc' ? '\u2191' : '\u2193') : '\u2195'}</span></button> : c.header}
              </th>
            );
          })}
        </tr></thead>
        <tbody ref={body}>
          {loading ? Array.from({ length: loadingRows }, (_, i) => (
            <tr key={'s' + i}>{Array.from({ length: columns.length + extra }, (_, j) => <td key={j} style={{ padding: sz.p, borderTop: i ? '1px solid var(--rule-soft)' : 0 }}><span style={{ display: 'block', height: 12, width: j === 0 ? '70%' : '50%', background: 'var(--paper-2)', animation: 'of-pulse 2s ease-in-out infinite' }} /></td>)}</tr>
          )) : rows.length === 0 ? (
            <tr><td colSpan={columns.length + extra} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: 15 }}>{emptyText}</td></tr>
          ) : rows.map((r, i) => { const k = keyOf(r, i); return (
            <TR key={k} row={r} cols={columns} sz={sz} i={i} striped={striped} bordered={bordered} selectable={selectable} isSel={sel.includes(k)}
              onSel={() => setSel(sel.includes(k) ? sel.filter(x => x !== k) : [...sel, k])} expandable={!!renderExpanded} isOpen={open.includes(k)}
              onOpen={() => setOpen(o => o.includes(k) ? o.filter(x => x !== k) : [...o, k])} onRowClick={onRowClick} renderExpanded={renderExpanded} name={nameOf(r, k)} id={uid + 'x' + i} />
          ); })}
        </tbody>
      </table>
    </div>
  );
}

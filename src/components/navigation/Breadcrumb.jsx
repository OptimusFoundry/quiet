import React from 'react';

function Crumb({ it, current, fs }) {
  const [h, setH] = React.useState(false);
  const s = { display: 'inline-flex', alignItems: 'center', gap: 6, color: current ? 'var(--ink)' : h ? 'var(--molten)' : 'var(--muted)', textDecoration: 'none', transition: 'color var(--dur-hover) var(--ease-soft)', cursor: it.href || it.onClick ? 'pointer' : 'default', background: 'none', border: 0, padding: 0, font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' };
  const inner = <>{it.icon}{it.label}</>;
  const hv = { onMouseEnter: () => setH(true), onMouseLeave: () => setH(false), onFocus: e => e.currentTarget.matches(':focus-visible') && setH(true), onBlur: () => setH(false) };
  if (current) return <span aria-current="page" style={s}>{inner}</span>;
  if (it.href) return <a href={it.href} {...hv} style={s}>{inner}</a>;
  return <button type="button" onClick={it.onClick} {...hv} style={s}>{inner}</button>;
}

export function Breadcrumb({ items = [], separator = '/', maxItems, size = 'md', label, 'aria-label': ariaLabel, style }) {
  const [expanded, setExpanded] = React.useState(false);
  const olRef = React.useRef(null);
  const reveal = React.useRef(false);
  const fs = { sm: 10, md: 11, lg: 12 }[size] || 11;
  let list = items.map((it, i) => ({ ...it, _i: i }));
  const hidden = maxItems && items.length > maxItems ? items.length - maxItems : 0;
  if (hidden && !expanded) list = [list[0], { _more: true }, ...list.slice(items.length - (maxItems - 1))];
  // After "…" expands, move focus to the first revealed crumb so keyboard users keep their place.
  React.useEffect(() => {
    if (!expanded || !reveal.current || !olRef.current) return;
    reveal.current = false;
    const el = olRef.current.children[1] && olRef.current.children[1].lastElementChild;
    if (el) { if (el.tagName === 'SPAN') el.tabIndex = -1; el.focus(); }
  }, [expanded]);
  // Distinct default name per trail (the current page), so several breadcrumbs on one page stay distinguishable.
  const last = items[items.length - 1];
  const name = ariaLabel ?? label ?? (last && typeof last.label === 'string' ? 'Breadcrumb: ' + last.label : 'Breadcrumb');
  return (
    <nav aria-label={name} style={style}>
      <ol ref={olRef} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: fs, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {list.map((it, i) => (
          <li key={it._more ? 'more' : it._i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {i > 0 && <span aria-hidden="true" style={{ color: 'var(--muted-2)' }}>{separator}</span>}
            {it._more
              ? <button type="button" aria-label={'Show ' + hidden + ' more ' + (hidden === 1 ? 'item' : 'items')} aria-expanded={false} onClick={() => { reveal.current = true; setExpanded(true); }} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'var(--muted)', font: 'inherit' }}>{'…'}</button>
              : <Crumb it={it} current={it._i === items.length - 1} fs={fs} />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

import React from 'react';

function Crumb({ it, current, fs }) {
  const [h, setH] = React.useState(false);
  const s = { display: 'inline-flex', alignItems: 'center', gap: 6, color: current ? 'var(--ink)' : h ? 'var(--molten)' : 'var(--muted)', textDecoration: 'none', transition: 'color var(--dur-hover) var(--ease-soft)', cursor: it.href || it.onClick ? 'pointer' : 'default', background: 'none', border: 0, padding: 0, font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit' };
  const inner = <>{it.icon}{it.label}</>;
  if (current) return <span aria-current="page" style={s}>{inner}</span>;
  if (it.href) return <a href={it.href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={s}>{inner}</a>;
  return <button type="button" onClick={it.onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={s}>{inner}</button>;
}

export function Breadcrumb({ items = [], separator = '/', maxItems, size = 'md', style }) {
  const [expanded, setExpanded] = React.useState(false);
  const fs = { sm: 10, md: 11, lg: 12 }[size] || 11;
  let list = items.map((it, i) => ({ ...it, _i: i }));
  if (maxItems && items.length > maxItems && !expanded) list = [list[0], { _more: true }, ...list.slice(items.length - (maxItems - 1))];
  return (
    <nav aria-label="Breadcrumb" style={style}>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, fontFamily: 'var(--font-mono)', fontSize: fs, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        {list.map((it, i) => (
          <li key={it._more ? 'more' : it._i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {i > 0 && <span aria-hidden="true" style={{ color: 'var(--muted-2)' }}>{separator}</span>}
            {it._more
              ? <button type="button" aria-label="Show all" onClick={() => setExpanded(true)} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', color: 'var(--muted)', font: 'inherit' }}>{'\u2026'}</button>
              : <Crumb it={it} current={it._i === items.length - 1} fs={fs} />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-rise')) {
  const s = document.createElement('style'); s.id = 'of-kf-rise';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}';
  document.head.appendChild(s);
}
const SIZES = { sm: { p: '8px 12px', fs: 13, s: 12 }, md: { p: '14px 16px', fs: 15, s: 13 }, lg: { p: '20px 20px', fs: 17, s: 15 } };

function LI({ it, sz, divided, first, i, animated, bordered }) {
  const [h, setH] = React.useState(false);
  const interactive = !!(it.onClick || it.href) && !it.disabled;
  const El = it.href ? 'a' : it.onClick ? 'button' : 'div';
  return (
    <div role="listitem" style={{ display: 'contents' }}>
    <El href={it.disabled ? undefined : it.href} type={El === 'button' ? 'button' : undefined} onClick={it.disabled ? undefined : it.onClick} disabled={El === 'button' ? it.disabled : undefined}
      aria-disabled={El === 'a' && it.disabled ? true : undefined} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} aria-current={it.selected || undefined}
      onFocus={interactive ? e => e.currentTarget.matches(':focus-visible') && setH(true) : undefined} onBlur={interactive ? () => setH(false) : undefined}
      style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', boxSizing: 'border-box', padding: bordered ? sz.p : sz.p.split(' ')[0] + ' 0', textAlign: 'left', textDecoration: 'none', font: 'inherit',
        background: it.selected || (interactive && h) ? 'var(--paper-2)' : 'transparent', border: 0, borderRadius: interactive && !bordered ? 'var(--radius-sm)' : 0, borderTop: divided && !first ? '1px solid var(--rule-soft)' : 'none', color: 'inherit',
        cursor: interactive ? 'pointer' : it.disabled ? 'not-allowed' : 'default', opacity: it.disabled ? 0.4 : 1, transition: 'background var(--dur-hover) var(--ease-soft)',
        animation: animated ? 'of-rise 0.4s var(--ease-forge) both' : 'none', animationDelay: animated ? i * 60 + 'ms' : undefined, ...(interactive && !bordered ? { paddingLeft: 8, paddingRight: 8, margin: '0 -8px', width: 'calc(100% + 16px)' } : {}) }}>
      {it.leading != null && <span style={{ flex: 'none', display: 'inline-flex', color: 'var(--muted)' }}>{it.leading}</span>}
      <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: sz.fs, color: 'var(--ink)', lineHeight: 1.4 }}>{it.primary}</span>
        {it.secondary && <span style={{ fontSize: sz.s, color: 'var(--muted)', lineHeight: 1.45 }}>{it.secondary}</span>}
      </span>
      {it.trailing != null && <span style={{ flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--muted)', fontFamily: typeof it.trailing === 'string' ? 'var(--font-mono)' : undefined, fontSize: typeof it.trailing === 'string' ? 11 : undefined, letterSpacing: typeof it.trailing === 'string' ? '0.08em' : undefined, textTransform: typeof it.trailing === 'string' ? 'uppercase' : undefined }}>{it.trailing}</span>}
      {interactive && it.trailing == null && <span aria-hidden="true" style={{ color: h ? 'var(--molten)' : 'var(--muted)', transition: 'color var(--dur-hover) var(--ease-soft), transform var(--dur-hover) var(--ease-soft)', transform: h ? 'translateX(4px)' : 'none' }}>{'\u2192'}</span>}
    </El>
    </div>
  );
}

export function List({ items, groups, size = 'md', divided = true, bordered = false, animated = false, style }) {
  const sz = SIZES[size] || SIZES.md;
  const gs = groups || [{ items: items || [] }];
  const uid = React.useId();
  let n = 0;
  return (
    <div role={groups ? undefined : 'list'} style={{ display: 'flex', flexDirection: 'column', gap: groups ? 24 : 0, ...(bordered ? { border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' } : {}), ...style }}>
      {gs.map((g, gi) => (
        <div key={gi} role={groups ? 'list' : undefined} aria-labelledby={groups && g.label ? uid + gi : undefined} style={{ display: 'flex', flexDirection: 'column' }}>
          {g.label && <div id={uid + gi} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', padding: bordered ? '12px 16px 8px' : '0 0 8px', borderBottom: '1px solid var(--ink)' }}>{g.label}</div>}
          {g.items.map((it, i) => <LI key={it.id ?? i} it={it} sz={sz} divided={divided} first={i === 0 && !g.label} i={n++} animated={animated} bordered={bordered} />)}
        </div>
      ))}
    </div>
  );
}

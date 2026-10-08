import React from 'react';

const SIZES = { sm: 32, md: 40, lg: 48 };
function range(page, total, siblings) {
  const out = []; const lo = Math.max(2, page - siblings), hi = Math.min(total - 1, page + siblings);
  out.push(1);
  if (lo > 2) out.push('l');
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < total - 1) out.push('r');
  if (total > 1) out.push(total);
  return out;
}

function PageBtn({ children, on, disabled, onClick, variant, h, label }) {
  const [hv, setHv] = React.useState(false);
  const hover = hv && !disabled && !on;
  const st = {
    default: on ? { background: 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)' } : { background: hover ? 'var(--paper-2)' : 'transparent', color: 'var(--ink)', border: '1px solid transparent' },
    outline: on ? { background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)' } : { background: hover ? 'var(--paper-2)' : 'transparent', color: 'var(--ink)', border: '1px solid var(--rule-soft)' },
    ghost: on ? { background: 'var(--paper-2)', color: 'var(--ink)', border: '1px solid transparent' } : { background: 'transparent', color: hover ? 'var(--molten)' : 'var(--muted)', border: '1px solid transparent' },
  }[variant];
  return (
    <button type="button" aria-label={label} aria-current={on ? 'page' : undefined} disabled={disabled} onClick={onClick} onMouseEnter={() => setHv(true)} onMouseLeave={() => setHv(false)}
      style={{ minWidth: h, height: h, padding: '0 8px', boxSizing: 'border-box', borderRadius: 999, fontFamily: 'var(--font-mono)', fontSize: h > 40 ? 13 : 12, fontVariantNumeric: 'tabular-nums',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.3 : 1, transition: 'background var(--dur-hover) var(--ease-soft), color var(--dur-hover) var(--ease-soft)', ...st }}>{children}</button>
  );
}

export function Pagination({ page, defaultPage = 1, total = 1, onChange, siblings = 1, showFirstLast = true, variant = 'default', size = 'md', disabled = false, style }) {
  const [inner, setInner] = React.useState(defaultPage);
  const cur = page ?? inner;
  const h = SIZES[size] || 40;
  const go = p => { if (p < 1 || p > total || p === cur) return; setInner(p); onChange && onChange(p); };
  const b = (k, ch, p, lab, on) => <PageBtn key={k} h={h} variant={variant} on={on} label={lab} disabled={disabled || (!on && (p < 1 || p > total || p === cur))} onClick={() => go(p)}>{ch}</PageBtn>;
  return (
    <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', ...style }}>
      {showFirstLast && b('f', '\u00ab', 1, 'First page')}
      {b('p', '\u2190', cur - 1, 'Previous page')}
      {range(cur, total, siblings).map(p => typeof p === 'string'
        ? <span key={p} aria-hidden="true" style={{ minWidth: h, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted-2)' }}>{'\u2026'}</span>
        : b(p, String(p).padStart(2, '0'), p, 'Page ' + p, p === cur))}
      {b('n', '\u2192', cur + 1, 'Next page')}
      {showFirstLast && b('l', '\u00bb', total, 'Last page')}
    </nav>
  );
}

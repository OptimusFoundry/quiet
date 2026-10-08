import React from 'react';
import './Pagination.scss';

const VARIANTS = ['default', 'outline', 'ghost'];
function range(page, total, siblings) {
  const out = []; const lo = Math.max(2, page - siblings), hi = Math.min(total - 1, page + siblings);
  out.push(1);
  if (lo > 2) out.push('l');
  for (let i = lo; i <= hi; i++) out.push(i);
  if (hi < total - 1) out.push('r');
  if (total > 1) out.push(total);
  return out;
}

function PageBtn({ children, on, disabled, onClick, label }) {
  return (
    <button type="button" className="q-pagination__page" aria-label={label} aria-current={on ? 'page' : undefined} disabled={disabled} onClick={onClick}>{children}</button>
  );
}

export function Pagination({ page, defaultPage = 1, total = 1, onChange, siblings = 1, showFirstLast = true, variant = 'default', size = 'md', disabled = false, label, 'aria-label': ariaLabel, className, style }) {
  const [inner, setInner] = React.useState(defaultPage);
  const cur = page ?? inner;
  const go = p => { if (p < 1 || p > total || p === cur) return; setInner(p); onChange && onChange(p); };
  const b = (k, ch, p, lab, on) => <PageBtn key={k} on={on} label={lab} disabled={disabled || (!on && (p < 1 || p > total || p === cur))} onClick={() => go(p)}>{ch}</PageBtn>;
  return (
    <nav aria-label={ariaLabel ?? label ?? 'Pagination, page ' + cur + ' of ' + total} className={['q-pagination', 'q-pagination--' + (VARIANTS.includes(variant) ? variant : 'default'), (size === 'sm' || size === 'lg') && 'q-pagination--' + size, className].filter(Boolean).join(' ')} style={style}>
      {showFirstLast && b('f', '\u00ab', 1, 'First page')}
      {b('p', '\u2190', cur - 1, 'Previous page')}
      {range(cur, total, siblings).map(p => typeof p === 'string'
        ? <span key={p} aria-hidden="true" className="q-pagination__ellipsis">{'\u2026'}</span>
        : b(p, String(p).padStart(2, '0'), p, 'Page ' + p, p === cur))}
      {b('n', '\u2192', cur + 1, 'Next page')}
      {showFirstLast && b('l', '\u00bb', total, 'Last page')}
    </nav>
  );
}

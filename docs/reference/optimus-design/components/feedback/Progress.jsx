import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-indet')) {
  const s = document.createElement('style'); s.id = 'of-kf-indet';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-indet{0%{left:-30%}100%{left:100%}}}';
  document.head.appendChild(s);
}
const SIZES = { sm: 1, md: 2, lg: 4 };

export function Progress({ value = 0, max = 100, size = 'md', variant = 'default', indeterminate = false, label, showValue = false, style }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const h = SIZES[size] || 2;
  const fill = variant === 'error' || variant === 'warning' || variant === 'heat' ? 'var(--molten)' : 'var(--ink)';
  const done = !indeterminate && pct >= 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {(label || showValue) && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        <span>{label}</span>
        {showValue && !indeterminate && <span style={{ color: variant === 'error' ? 'var(--molten)' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{done && variant === 'success' ? '\u2713 ' : ''}{Math.round(pct)}%</span>}
      </div>}
      <div role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={indeterminate ? undefined : value} aria-label={typeof label === 'string' ? label : undefined}
        style={{ position: 'relative', height: h, background: 'var(--rule-soft)', borderRadius: 999, overflow: 'hidden' }}>
        <span style={indeterminate
          ? { position: 'absolute', top: 0, bottom: 0, left: 0, width: '30%', borderRadius: 999, background: fill, animation: 'of-indet 1.6s var(--ease-forge) infinite' }
          : { position: 'absolute', top: 0, bottom: 0, left: 0, width: pct + '%', borderRadius: 999, background: fill, transition: 'width 0.4s var(--ease-soft)' }} />
      </div>
    </div>
  );
}

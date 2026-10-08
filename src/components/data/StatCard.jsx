import React from 'react';

function useCount(target, on, dur = 1200) {
  const [v, setV] = React.useState(on ? 0 : target);
  React.useEffect(() => {
    if (!on || typeof target !== 'number') { setV(target); return; }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); return; }
    let raf; const t0 = performance.now();
    const step = t => { const p = Math.min(1, (t - t0) / dur); const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; setV(target * e); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [target, on]);
  return v;
}

export function StatCard({ label, value, format, delta, trend, period, previousValue, icon, variant = 'outlined', animate = false, onClick, href, style }) {
  const [h, setH] = React.useState(false);
  const shown = useCount(value, animate && typeof value === 'number');
  const fmt = format || (v => typeof v === 'number' ? Math.round(v).toLocaleString('en-US') : v);
  const tr = trend || (typeof delta === 'number' ? (delta > 0 ? 'up' : delta < 0 ? 'down' : 'neutral') : typeof delta === 'string' ? (delta.trim().startsWith('-') || delta.trim().startsWith('\u2212') ? 'down' : 'up') : 'neutral');
  const glyph = { up: '\u2197', down: '\u2198', neutral: '\u2192' }[tr];
  const deltaText = typeof delta === 'number' ? (delta > 0 ? '+' : delta < 0 ? '\u2212' : '') + Math.abs(delta) + '%' : delta;
  const interactive = !!(onClick || href);
  const El = href ? 'a' : onClick ? 'button' : 'div';
  const v = {
    outlined: { borderRadius: 'var(--radius-lg)', background: 'var(--paper)', border: '1px solid ' + (interactive && h ? 'var(--rule-strong)' : 'var(--rule-soft)') },
    filled: { borderRadius: 'var(--radius-lg)', background: 'var(--paper-2)', border: '1px solid ' + (interactive && h ? 'var(--rule-strong)' : 'var(--paper-2)') },
    plain: { background: 'transparent', border: '1px solid transparent', borderTop: '1px solid var(--ink)' },
  }[variant];
  return (
    <El href={href} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: variant === 'plain' ? '24px 0 0' : 24, boxSizing: 'border-box', textAlign: 'left', textDecoration: 'none', font: 'inherit', color: 'inherit', borderRadius: 0,
        cursor: interactive ? 'pointer' : 'default', transition: 'border-color var(--dur-hover) var(--ease-soft)', ...v, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>
        {icon && <span aria-hidden="true" style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid var(--rule-soft)', display: 'grid', placeItems: 'center', color: 'var(--ink)', fontSize: 15 }}>{icon}</span>}
      </div>
      <div style={{ fontWeight: 700, fontSize: 40, letterSpacing: '-0.04em', lineHeight: 1, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', minWidth: 0, overflowWrap: 'anywhere' }}>{fmt(shown)}</div>
      {(delta != null || period || previousValue != null) && <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: 'var(--muted)' }}>
        {delta != null && <span style={{ display: 'inline-flex', gap: 4, color: 'var(--ink)' }}><span aria-hidden="true" style={{ color: tr === 'down' ? 'var(--molten)' : 'var(--ink)' }}>{glyph}</span>{deltaText}</span>}
        {period && <span style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>{period}</span>}
        {previousValue != null && <span>Prev {fmt(previousValue)}</span>}
      </div>}
    </El>
  );
}

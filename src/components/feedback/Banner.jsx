import React from 'react';

const GLYPH = { info: 'i', success: '\u2713', warning: '!', error: '!' };

export function Banner({ variant = 'paper', status = 'info', title, children, action, onDismiss, dismissible = true, label, style }) {
  // quiet: dismiss collapses the strip's height (0 rest · 1 wrapped · 2 collapsing · 3 gone).
  const [leave, setLeave] = React.useState(0);
  const id = React.useId();
  React.useEffect(() => {
    if (leave === 1) { let r = requestAnimationFrame(() => { r = requestAnimationFrame(() => setLeave(2)); }); return () => cancelAnimationFrame(r); }
    if (leave !== 2) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(() => { setLeave(3); onDismiss && onDismiss(); }, reduce ? 0 : 280);
    return () => clearTimeout(t);
  }, [leave]);
  if (leave === 3) return null;
  const ink = variant === 'ink';
  const hot = status === 'warning' || status === 'error';
  const bg = ink ? 'var(--ink)' : variant === 'paper' ? 'var(--paper-2)' : 'var(--paper)';
  const fg = ink ? 'var(--paper)' : 'var(--ink)';
  const box = (
    <div role={status === 'error' ? 'alert' : 'region'} aria-labelledby={title ? id : undefined} aria-label={title ? undefined : label || 'Notice'} style={{ width: '100%', boxSizing: 'border-box', background: bg, color: fg,
      borderTop: variant === 'outline' ? '1px solid var(--ink)' : 'none', borderBottom: '1px solid ' + (ink ? 'var(--ink)' : variant === 'outline' ? 'var(--ink)' : 'var(--rule-soft)'), ...style }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '12px var(--gutter)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span aria-hidden="true" style={{ flex: 'none', width: 20, height: 20, borderRadius: 999, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, lineHeight: 1,
          border: '1px solid ' + (hot ? 'var(--molten)' : ink ? 'rgba(255,255,255,0.4)' : 'var(--ink)'), color: hot ? 'var(--molten)' : fg }}>{GLYPH[status]}</span>
        <div style={{ flex: 1, minWidth: 200, fontSize: 15, lineHeight: 1.45 }}>
          {title && <strong id={id} style={{ fontWeight: 600 }}>{title}</strong>}{title && children ? ' ' : ''}
          {children && <span style={{ color: ink ? 'rgba(255,255,255,0.72)' : 'var(--ink-2)' }}>{children}</span>}
        </div>
        {action}
        {dismissible && <button type="button" aria-label="Dismiss banner" onClick={() => setLeave(l => l || 1)}
          style={{ background: 'none', border: 0, cursor: 'pointer', color: ink ? 'var(--paper)' : 'var(--muted)', fontSize: 18, lineHeight: 1, padding: 0 }}>{'\u00d7'}</button>}
      </div>
    </div>
  );
  return leave ? <div className="q-collapse" data-open={leave === 1 ? 'true' : 'false'} style={{ opacity: leave === 1 ? 1 : 0, transition: 'opacity var(--dur-expand) var(--ease-soft)' }}><div className="q-collapse-inner" inert>{box}</div></div> : box;
}

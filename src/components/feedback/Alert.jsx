import React from 'react';

const V = {
  info: { border: 'var(--rule-soft)', ring: 'var(--muted-2)', glyph: 'i', gc: 'var(--muted)' },
  success: { border: 'var(--ink)', ring: 'var(--ink)', glyph: '\u2713', gc: 'var(--ink)' },
  warning: { border: 'var(--rule-soft)', ring: 'var(--molten)', glyph: '!', gc: 'var(--molten)' },
  error: { border: 'var(--molten)', ring: 'var(--molten)', glyph: '!', gc: 'var(--molten)' },
};

export function Alert({ variant = 'info', title, children, icon, action, onDismiss, style }) {
  const v = V[variant] || V.info;
  const glyph = icon === false ? null : icon || <span style={{ width: 20, height: 20, borderRadius: 999, border: '1px solid ' + v.ring, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, color: v.gc, lineHeight: 1 }}>{v.glyph}</span>;
  return (
    <div role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 20px', background: 'var(--paper)', border: '1px solid ' + v.border, borderRadius: 'var(--radius-md)', ...style }}>
      {glyph && <span aria-hidden="true" style={{ flex: 'none', display: 'inline-flex', marginTop: 1 }}>{glyph}</span>}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {title && <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.4, color: 'var(--ink)' }}>{title}</div>}
        {children && <div style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)', textWrap: 'pretty' }}>{children}</div>}
        {action && <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>{action}</div>}
      </div>
      {onDismiss && <button type="button" aria-label="Dismiss" onClick={onDismiss} style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--muted)', fontSize: 18, lineHeight: 1, padding: 0 }}>{'\u00d7'}</button>}
    </div>
  );
}

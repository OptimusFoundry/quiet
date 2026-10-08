import React from 'react';

const SIZES = { sm: { t: 19, p: 32, ring: 32 }, md: { t: 24, p: 48, ring: 40 }, lg: { t: 30, p: 64, ring: 48 } };

export function EmptyState({ icon = '/', eyebrow, title, accent, description, actions, size = 'md', bordered = false, align = 'center', style }) {
  const sz = SIZES[size] || SIZES.md;
  const center = align === 'center';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: center ? 'center' : 'flex-start', textAlign: center ? 'center' : 'left', gap: 16, padding: sz.p,
      border: bordered ? '1px dashed var(--muted-2)' : 'none', borderRadius: 'var(--radius-lg)', boxSizing: 'border-box', ...style }}>
      {icon && <span aria-hidden="true" style={{ width: sz.ring, height: sz.ring, borderRadius: 999, border: '1px solid var(--rule-soft)', display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-mono)', fontSize: sz.ring * 0.38, color: 'var(--muted)' }}>{icon}</span>}
      {eyebrow && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{eyebrow}</span>}
      {title && <div style={{ fontWeight: 600, fontSize: sz.t, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)', textWrap: 'balance' }}>
        {title}{accent && <> <em>{accent}</em></>}<span style={{ color: 'var(--molten)' }}>.</span></div>}
      {description && <p style={{ margin: 0, maxWidth: 420, fontSize: size === 'sm' ? 15 : 17, lineHeight: 1.55, color: 'var(--muted)', textWrap: 'pretty' }}>{description}</p>}
      {actions && <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: center ? 'center' : 'flex-start', marginTop: 8 }}>{actions}</div>}
    </div>
  );
}

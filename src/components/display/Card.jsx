import React from 'react';

export function Card({ eyebrow, title, accent, children, meta, footer, href, onClick, style }) {
  const [h, setH] = React.useState(false);
  const interactive = !!(href || onClick);
  const El = href ? 'a' : 'div';
  return (
    <El href={href} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onFocus={interactive ? e => e.currentTarget.matches(':focus-visible') && setH(true) : undefined} onBlur={interactive ? () => setH(false) : undefined}
      {...(!href && onClick ? { role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(e); } } } : {})}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 32, background: 'var(--paper)', borderRadius: 'var(--radius-lg)', textDecoration: 'none',
        border: '1px solid ' + (interactive && h ? 'var(--rule-strong)' : 'var(--rule-soft)'), boxShadow: interactive && h ? 'var(--shadow-2)' : 'none', color: 'var(--ink-2)', cursor: interactive ? 'pointer' : 'default',
        transition: 'border-color var(--dur-hover) var(--ease-soft), box-shadow var(--dur-hover) var(--ease-soft)', ...style }}>
      {eyebrow && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{eyebrow}</div>}
      {title && <div style={{ fontWeight: 600, fontSize: 24, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
        {title}{accent && <> <em style={{ fontStyle: 'italic', fontWeight: 600 }}>{accent}</em></>}
      </div>}
      {children && <div style={{ fontSize: 15, lineHeight: 1.55, textWrap: 'pretty' }}>{children}</div>}
      {(meta || footer) && <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--rule-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        {meta && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{meta}</div>}
        {footer}
      </div>}
    </El>
  );
}

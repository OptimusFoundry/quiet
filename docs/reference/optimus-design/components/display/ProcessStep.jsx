import React from 'react';

export function ProcessStep({ numeral, title, children, hot = false, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, ...style }}>
      <div style={{ height: 2, background: hot ? 'var(--molten)' : 'var(--rule-soft)', transition: 'background 1s linear' }} />
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', color: hot ? 'var(--molten)' : 'var(--muted)', transition: 'color 1s linear' }}>{numeral}</div>
      <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)' }}>{title}</div>
      {children && <div style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)', textWrap: 'pretty' }}>{children}</div>}
    </div>
  );
}

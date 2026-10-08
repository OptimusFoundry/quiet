import React from 'react';

export function Stat({ value, label, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      <div style={{ fontWeight: 700, fontSize: 48, lineHeight: 1, letterSpacing: '-0.045em', color: 'var(--ink)' }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}

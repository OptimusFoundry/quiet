import React from 'react';

export function Eyebrow({ index, children, tone = 'muted', style }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: tone === 'ink' ? 'var(--ink)' : 'var(--muted)', ...style }}>
      {index != null && <span style={{ color: 'var(--ink)' }}>{index}</span>}
      <span>{children}</span>
    </div>
  );
}

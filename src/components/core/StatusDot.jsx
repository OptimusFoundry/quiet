import React from 'react';

export function StatusDot({ label, status = 'live', style }) {
  const color = status === 'live' ? 'var(--molten)' : status === 'prototype' ? 'var(--muted-2)' : 'var(--ink)';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11,
      letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)', ...style }}>
      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 999, background: status === 'prototype' ? 'transparent' : color,
        border: status === 'prototype' ? '1px solid var(--muted-2)' : 'none', boxSizing: 'border-box' }} />
      {label ?? status}
    </span>
  );
}

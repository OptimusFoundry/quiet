import React from 'react';

const SIZES = { nav: 15, footer: 28 };

export function Wordmark({ size = 'nav', style }) {
  const fs = typeof size === 'number' ? size : SIZES[size];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', fontFamily: 'var(--font-sans)', fontWeight: 700, fontStyle: 'italic',
      textTransform: 'uppercase', letterSpacing: '-0.02em', fontSize: fs, lineHeight: 1, color: 'var(--ink)', whiteSpace: 'nowrap', ...style }}>
      Optimus Foundry<span style={{ color: 'var(--molten)' }}>.</span>
    </span>
  );
}

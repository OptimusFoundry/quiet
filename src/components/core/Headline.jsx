import React from 'react';

const SIZES = {
  display: { fontSize: 'var(--type-display-size)', lineHeight: 0.92, letterSpacing: '-0.045em', fontWeight: 700 },
  h2: { fontSize: 'var(--type-h2-size)', lineHeight: 1, letterSpacing: '-0.04em', fontWeight: 700 },
  h3: { fontSize: 'var(--type-h3-size)', lineHeight: 1.1, letterSpacing: '-0.025em', fontWeight: 600 },
  h4: { fontSize: 'var(--type-h4-size)', lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 600 },
};
const TAGS = { display: 'h1', h2: 'h2', h3: 'h3', h4: 'h4' };

export function Headline({ size = 'h2', as, lead, accent, after, period = true, moltenAccent = false, style }) {
  const Tag = as || TAGS[size];
  return (
    <Tag style={{ margin: 0, fontFamily: 'var(--font-sans)', color: 'var(--ink)', textWrap: 'balance', ...SIZES[size], ...style }}>
      {lead}{lead && accent ? ' ' : ''}
      {accent && <em style={{ fontStyle: 'italic', color: moltenAccent ? 'var(--molten)' : 'inherit' }}>{accent}</em>}
      {after ? (accent ? ' ' : '') + after : ''}
      {period && <span style={{ color: 'var(--molten)' }}>.</span>}
    </Tag>
  );
}

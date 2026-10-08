import React from 'react';

export function Rule({ tone = 'soft', variant = 'solid', orientation = 'horizontal', label, labelAlign = 'center', style }) {
  const line = '1px ' + variant + ' ' + (tone === 'ink' ? 'var(--ink)' : 'var(--rule-soft)');
  const name = typeof label === 'string' ? label : undefined;
  const lab = label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{label}</span>;
  if (orientation === 'vertical') {
    if (!label) return <span role="separator" aria-orientation="vertical" style={{ display: 'inline-block', alignSelf: 'stretch', width: 0, minHeight: 16, borderLeft: line, ...style }} />;
    return (
      <span role="separator" aria-orientation="vertical" aria-label={name} style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch', gap: 8, ...style }}>
        <span style={{ flex: 1, borderLeft: line }} />{lab}<span style={{ flex: 1, borderLeft: line }} />
      </span>
    );
  }
  if (!label) return <hr style={{ border: 0, borderTop: line, margin: 0, ...style }} />;
  return (
    <div role="separator" aria-label={name} style={{ display: 'flex', alignItems: 'center', gap: 16, ...style }}>
      {labelAlign !== 'start' && <span style={{ flex: 1, borderTop: line }} />}{lab}<span style={{ flex: 1, borderTop: line }} />
    </div>
  );
}

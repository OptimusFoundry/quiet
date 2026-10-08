import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-spin')) {
  const s = document.createElement('style'); s.id = 'of-kf-spin';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-spin{to{transform:rotate(360deg)}}}';
  document.head.appendChild(s);
}
const SIZES = { xs: 12, sm: 16, md: 24, lg: 32, xl: 48 };
const TONES = { default: 'var(--ink)', muted: 'var(--muted)', paper: 'var(--paper)', molten: 'var(--molten)' };

export function Spinner({ size = 'md', tone = 'default', label, style, ...rest }) {
  const px = typeof size === 'number' ? size : SIZES[size] || 24;
  return (
    <span role="status" aria-label={label || 'Loading'} {...rest} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, ...style }}>
      <span style={{ width: px, height: px, flex: 'none', boxSizing: 'border-box', borderRadius: 999,
        border: (px >= 32 ? 2 : 1) + 'px solid ' + (tone === 'paper' ? 'rgba(255,255,255,0.28)' : 'var(--rule-soft)'),
        borderTopColor: TONES[tone] || tone, animation: 'of-spin 0.9s linear infinite' }} />
      {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>}
    </span>
  );
}

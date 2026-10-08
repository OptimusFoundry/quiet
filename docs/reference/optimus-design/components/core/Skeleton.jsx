import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-pulse')) {
  const s = document.createElement('style'); s.id = 'of-kf-pulse';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-pulse{0%,100%{opacity:1}50%{opacity:.45}}}';
  document.head.appendChild(s);
}

export function Skeleton({ variant = 'text', width, height, lines = 1, gap = 8, animate = true, style }) {
  const base = { display: 'block', background: 'var(--paper-2)', animation: animate ? 'of-pulse 2s ease-in-out infinite' : 'none', flex: 'none' };
  if (variant === 'text' && lines > 1) {
    return (
      <span style={{ display: 'flex', flexDirection: 'column', gap, width: width ?? '100%', ...style }}>
        {Array.from({ length: lines }, (_, i) => <span key={i} style={{ ...base, height: height ?? 12, width: i === lines - 1 ? '60%' : '100%' }} />)}
      </span>
    );
  }
  const dims = {
    text: { width: width ?? '100%', height: height ?? 12, borderRadius: 'var(--radius-xs)' },
    circular: { width: width ?? 40, height: height ?? width ?? 40, borderRadius: 999 },
    rectangular: { width: width ?? '100%', height: height ?? 120, borderRadius: 'var(--radius-lg)' },
    rounded: { width: width ?? 96, height: height ?? 32, borderRadius: 999 },
  }[variant];
  return <span aria-hidden="true" style={{ ...base, ...dims, ...style }} />;
}

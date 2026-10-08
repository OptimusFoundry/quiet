import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-rise')) {
  const s = document.createElement('style'); s.id = 'of-kf-rise';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}';
  document.head.appendChild(s);
}
const GAPS = { none: 0, xs: 8, sm: 16, md: 24, lg: 32, xl: 48, '2xl': 64 };

export function Stack({ direction = 'column', gap = 'sm', align, justify, wrap = false, animated = false, as = 'div', children, style }) {
  const Tag = as;
  const kids = animated ? React.Children.toArray(children).map((c, i) => <div key={i} style={{ animation: 'of-rise 0.4s var(--ease-forge) both', animationDelay: i * 60 + 'ms' }}>{c}</div>) : children;
  return <Tag style={{ display: 'flex', flexDirection: direction, gap: GAPS[gap] ?? gap, alignItems: align, justifyContent: justify, flexWrap: wrap ? 'wrap' : 'nowrap', minWidth: 0, ...style }}>{kids}</Tag>;
}

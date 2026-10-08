import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-rise')) {
  const s = document.createElement('style'); s.id = 'of-kf-rise';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}';
  document.head.appendChild(s);
}
const GAPS = { none: 0, xs: 8, sm: 16, md: 24, lg: 32, xl: 48, '2xl': 64 };
const GridCtx = React.createContext('lg');

export function Grid({ columns = 3, minChildWidth, gap = 'md', rowGap, align, animated = false, breakpoints = [720, 960], as = 'div', children, style }) {
  const Tag = as;
  const ref = React.useRef(null);
  const [bp, setBp] = React.useState('lg');
  React.useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => { const w = e.contentRect.width; setBp(w < breakpoints[0] ? 'sm' : w < breakpoints[1] ? 'md' : 'lg'); });
    ro.observe(ref.current); return () => ro.disconnect();
  }, [breakpoints[0], breakpoints[1]]);
  const tpl = minChildWidth ? 'repeat(auto-fit, minmax(min(' + (typeof minChildWidth === 'number' ? minChildWidth + 'px' : minChildWidth) + ', 100%), 1fr))'
    : typeof columns === 'number' ? 'repeat(' + columns + ', minmax(0, 1fr))' : columns;
  const kids = animated ? React.Children.toArray(children).map((c, i) => <div key={i} style={{ animation: 'of-rise 0.4s var(--ease-forge) both', animationDelay: i * 60 + 'ms', minWidth: 0, display: 'grid' }}>{c}</div>) : children;
  return (
    <GridCtx.Provider value={bp}>
      <Tag ref={ref} data-bp={bp} style={{ display: 'grid', gridTemplateColumns: tpl, gap: GAPS[gap] ?? gap, rowGap: rowGap != null ? GAPS[rowGap] ?? rowGap : undefined, alignItems: align, ...style }}>{kids}</Tag>
    </GridCtx.Provider>
  );
}
Grid.Ctx = GridCtx;

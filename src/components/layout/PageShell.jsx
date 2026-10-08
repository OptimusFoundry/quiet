import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-rise')) {
  const s = document.createElement('style'); s.id = 'of-kf-rise';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}';
  document.head.appendChild(s);
}
const TPL = { single: 'minmax(0, 1fr)', half: 'repeat(2, minmax(0, 1fr))', third: 'repeat(3, minmax(0, 1fr))', sidebar: 'minmax(0, 1fr) minmax(0, 2fr)', 'sidebar-right': 'minmax(0, 2fr) minmax(0, 1fr)' };

export function PageShell({ layout = 'single', narrow = false, header, children, gap = 32, animated = false, style }) {
  const kids = React.Children.toArray(children);
  const [stack, setStack] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setStack(e.contentRect.width < 720));
    ro.observe(ref.current); return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ width: '100%', maxWidth: narrow ? 880 : 'var(--container-max)', margin: '0 auto', padding: '0 var(--gutter) 96px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 48, ...style }}>
      {header}
      <div style={{ display: 'grid', gridTemplateColumns: stack ? 'minmax(0,1fr)' : TPL[layout] || TPL.single, gap, alignItems: 'start' }}>
        {kids.map((c, i) => <div key={i} style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap, animation: animated ? 'of-rise 0.4s var(--ease-forge) both' : 'none', animationDelay: animated ? i * 80 + 'ms' : undefined }}>{c}</div>)}
      </div>
    </div>
  );
}

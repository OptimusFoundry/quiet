import React from 'react';
import './PageShell.scss';

const LAYOUTS = ['single', 'half', 'third', 'sidebar', 'sidebar-right'];

export function PageShell({ layout = 'single', narrow = false, header, children, gap, animated = false, as = 'div', className, style }) {
  const Tag = as;
  const kids = React.Children.toArray(children);
  const [stack, setStack] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setStack(e.contentRect.width < 720));
    ro.observe(ref.current); return () => ro.disconnect();
  }, []);
  const mode = stack || !LAYOUTS.includes(layout) ? 'single' : layout;
  const cls = ['q-page-shell', 'q-page-shell--' + mode, narrow && 'q-page-shell--narrow', animated && 'q-page-shell--animated', className].filter(Boolean).join(' ');
  return (
    <Tag ref={ref} className={cls} style={{ ...(gap != null && { '--_gap': typeof gap === 'number' ? gap + 'px' : gap }), ...style }}>
      {header}
      <div className="q-page-shell__body">
        {kids.map((c, i) => <div key={i} className="q-page-shell__column" style={animated ? { '--_i': i } : undefined}>{c}</div>)}
      </div>
    </Tag>
  );
}

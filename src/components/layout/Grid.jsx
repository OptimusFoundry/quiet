import React from 'react';
import './Grid.scss';

const GAPS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const GridCtx = React.createContext('lg');
const px = v => (typeof v === 'number' ? v + 'px' : v);

export function Grid({ columns = 3, minChildWidth, gap = 'md', rowGap, align, animated = false, breakpoints = [720, 960], as = 'div', children, className, style }) {
  const Tag = as;
  const ref = React.useRef(null);
  const [bp, setBp] = React.useState('lg');
  React.useEffect(() => {
    if (!ref.current || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => { const w = e.contentRect.width; setBp(w < breakpoints[0] ? 'sm' : w < breakpoints[1] ? 'md' : 'lg'); });
    ro.observe(ref.current); return () => ro.disconnect();
  }, [breakpoints[0], breakpoints[1]]);
  const mode = minChildWidth ? 'auto' : typeof columns === 'number' ? null : 'template';
  const namedGap = GAPS.includes(gap);
  const namedRow = rowGap != null && GAPS.includes(rowGap);
  const cls = ['q-grid', mode && 'q-grid--' + mode, namedGap && 'q-grid--gap-' + gap, namedRow && 'q-grid--row-gap-' + rowGap, className].filter(Boolean).join(' ');
  const vars = {
    ...(mode === 'auto' ? { '--_min': px(minChildWidth) } : mode === 'template' ? { '--_template': columns } : { '--_cols': columns }),
    ...(!namedGap && { '--_gap': px(gap) }),
    ...(rowGap != null && !namedRow && { '--_row-gap': px(rowGap) }),
    ...(align && { '--_align': align }),
  };
  const kids = animated ? React.Children.toArray(children).map((c, i) => <div key={i} className="q-grid__item" style={{ '--_i': i }}>{c}</div>) : children;
  return (
    <GridCtx.Provider value={bp}>
      <Tag ref={ref} data-bp={bp} className={cls} style={{ ...vars, ...style }}>{kids}</Tag>
    </GridCtx.Provider>
  );
}
Grid.Ctx = GridCtx;

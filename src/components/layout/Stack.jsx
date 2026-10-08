import React from 'react';
import './Stack.scss';

const GAPS = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const DIRS = ['row', 'column', 'row-reverse', 'column-reverse'];
const px = v => (typeof v === 'number' ? v + 'px' : v);

export function Stack({ direction = 'column', gap = 'sm', align, justify, wrap = false, animated = false, as = 'div', children, className, style }) {
  const Tag = as;
  const named = GAPS.includes(gap);
  const cls = ['q-stack', DIRS.includes(direction) && 'q-stack--' + direction, named && 'q-stack--gap-' + gap, wrap && 'q-stack--wrap', className].filter(Boolean).join(' ');
  const vars = { ...(!named && { '--_gap': px(gap) }), ...(align && { '--_align': align }), ...(justify && { '--_justify': justify }) };
  const kids = animated ? React.Children.toArray(children).map((c, i) => <div key={i} className="q-stack__item" style={{ '--_i': i }}>{c}</div>) : children;
  return <Tag className={cls} style={{ ...vars, ...style }}>{kids}</Tag>;
}

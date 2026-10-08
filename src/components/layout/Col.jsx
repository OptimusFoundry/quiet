import React from 'react';
import { Grid } from './Grid';
import './Col.scss';

export function Col({ span = 12, spanMd, spanSm, start, rowSpan, as = 'div', children, className, style }) {
  const bp = React.useContext(Grid.Ctx || React.createContext('lg'));
  const eff = bp === 'sm' ? (spanSm ?? 12) : bp === 'md' ? (spanMd ?? (span < 4 ? 6 : span)) : span;
  const st = bp === 'lg' ? start : undefined;
  const rs = rowSpan && bp !== 'sm' ? rowSpan : undefined;
  const Tag = as;
  const cls = ['q-col', st && 'q-col--start', rs && 'q-col--row-span', className].filter(Boolean).join(' ');
  return <Tag className={cls} style={{ '--_span': eff, ...(st && { '--_start': st }), ...(rs && { '--_row-span': rs }), ...style }}>{children}</Tag>;
}

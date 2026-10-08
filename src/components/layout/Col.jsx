import React from 'react';
import { Grid } from './Grid';

export function Col({ span = 12, spanMd, spanSm, start, rowSpan, as = 'div', children, style }) {
  const bp = React.useContext(Grid.Ctx || React.createContext('lg'));
  const eff = bp === 'sm' ? (spanSm ?? 12) : bp === 'md' ? (spanMd ?? (span < 4 ? 6 : span)) : span;
  const st = bp === 'lg' ? start : undefined;
  const Tag = as;
  return <Tag style={{ gridColumn: (st ? st + ' / ' : '') + 'span ' + eff, gridRow: rowSpan && bp !== 'sm' ? 'span ' + rowSpan : undefined, minWidth: 0, ...style }}>{children}</Tag>;
}

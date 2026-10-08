import React from 'react';
import './Container.scss';

const SIZES = ['sm', 'md', 'lg', 'xl', 'full'];

export function Container({ size = 'xl', padded = true, centered = true, as = 'div', children, className, style }) {
  const Tag = as;
  const named = SIZES.includes(size);
  const cls = ['q-container', named && 'q-container--' + size, !padded && 'q-container--flush', !centered && 'q-container--start', className].filter(Boolean).join(' ');
  return <Tag className={cls} style={{ ...(!named && { '--_max': typeof size === 'number' ? size + 'px' : size }), ...style }}>{children}</Tag>;
}

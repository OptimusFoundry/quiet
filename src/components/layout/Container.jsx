import React from 'react';

const SIZES = { sm: 640, md: 880, lg: 1040, xl: 1280, full: 'none' };

export function Container({ size = 'xl', padded = true, centered = true, as = 'div', children, style }) {
  const Tag = as;
  const mw = SIZES[size] ?? size;
  return <Tag style={{ width: '100%', maxWidth: mw === 'none' ? 'none' : mw, marginLeft: centered ? 'auto' : 0, marginRight: centered ? 'auto' : 0, paddingLeft: padded ? 'var(--gutter)' : 0, paddingRight: padded ? 'var(--gutter)' : 0, boxSizing: 'border-box', ...style }}>{children}</Tag>;
}

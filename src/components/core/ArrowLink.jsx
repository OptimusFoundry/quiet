import React from 'react';
import './ArrowLink.scss';

export function ArrowLink({ href = '#', arrow = '→', children, className, style, ...rest }) {
  return (
    <a href={href} {...rest} className={['q-arrow-link', className].filter(Boolean).join(' ')} style={style}>
      {children}<span aria-hidden="true">{arrow}</span>
    </a>
  );
}

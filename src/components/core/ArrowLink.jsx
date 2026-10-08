import React from 'react';
import { useLinkElement } from '../../lib/link';
import './ArrowLink.scss';

export function ArrowLink({ href = '#', arrow = '→', children, className, style, ...rest }) {
  const A = useLinkElement(href);
  return (
    <A href={href} {...rest} className={['q-arrow-link', className].filter(Boolean).join(' ')} style={style}>
      {children}<span aria-hidden="true">{arrow}</span>
    </A>
  );
}

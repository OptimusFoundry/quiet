import React from 'react';
import { useLinkElement } from '../../lib/link';
import './Link.scss';

const SIZES = ['sm', 'md', 'lg'];

export function Link({ href = '#', variant = 'default', size = 'inherit', underline = 'hover', external = false, rightIcon, children, className, style, ...rest }) {
  const cls = ['q-link', variant === 'primary' || variant === 'muted' ? 'q-link--' + variant : null,
    SIZES.includes(size) && 'q-link--' + size, (underline === 'always' || underline === 'hover') && 'q-link--underline-' + underline,
    className].filter(Boolean).join(' ');
  const A = useLinkElement(href, external);
  return (
    <A href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
      {...rest} className={cls} style={style}>
      {children}
      {(rightIcon || external) && <span aria-hidden="true">{rightIcon || '↗'}</span>}
      {external && <span className="q-sr-only"> (opens in new tab)</span>}
    </A>
  );
}

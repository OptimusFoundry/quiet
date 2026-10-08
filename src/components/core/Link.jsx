import React from 'react';

export function Link({ href = '#', variant = 'default', size = 'inherit', underline = 'hover', external = false, rightIcon, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const h = hover || focus;
  const color = variant === 'muted' ? (h ? 'var(--ink)' : 'var(--muted)') : (h ? 'var(--molten)' : 'var(--ink)');
  const line = underline === 'always' || (underline === 'hover' && h) || variant === 'primary';
  const fs = { sm: 13, md: 15, lg: 17 }[size] || 'inherit';
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
      {...rest} onMouseEnter={e => { setHover(true); rest.onMouseEnter && rest.onMouseEnter(e); }}
      onMouseLeave={e => { setHover(false); rest.onMouseLeave && rest.onMouseLeave(e); }}
      onFocus={e => { setFocus(e.currentTarget.matches(':focus-visible')); rest.onFocus && rest.onFocus(e); }}
      onBlur={e => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, fontSize: fs, fontWeight: variant === 'primary' ? 600 : 'inherit', color, textDecoration: 'none',
        borderBottom: '1px solid ' + (line ? (variant === 'primary' && !h ? 'var(--rule-soft)' : 'currentColor') : 'transparent'),
        transition: 'color var(--dur-hover) var(--ease-soft), border-color var(--dur-hover) var(--ease-soft)', ...style }}>
      {children}
      {(rightIcon || external) && <span aria-hidden="true">{rightIcon || '\u2197'}</span>}
      {external && <span className="q-sr-only"> (opens in new tab)</span>}
    </a>
  );
}

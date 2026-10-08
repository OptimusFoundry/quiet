import React from 'react';

export function ArrowLink({ href = '#', arrow = '\u2192', children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const h = hover || focus;
  return (
    <a href={href} {...rest} onMouseEnter={e => { setHover(true); rest.onMouseEnter && rest.onMouseEnter(e); }}
      onMouseLeave={e => { setHover(false); rest.onMouseLeave && rest.onMouseLeave(e); }}
      onFocus={e => { setFocus(e.currentTarget.matches(':focus-visible')); rest.onFocus && rest.onFocus(e); }}
      onBlur={e => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15,
        color: h ? 'var(--molten)' : 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid ' + (h ? 'var(--molten)' : 'var(--rule-soft)'),
        paddingBottom: 2, transition: 'color var(--dur-hover) var(--ease-soft), border-color var(--dur-hover) var(--ease-soft)', ...style }}>
      {children}<span aria-hidden="true">{arrow}</span>
    </a>
  );
}

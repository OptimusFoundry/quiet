import React from 'react';

export function ArrowLink({ href = '#', arrow = '\u2192', children, style, ...rest }) {
  const [h, setH] = React.useState(false);
  return (
    <a href={href} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} {...rest}
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6, fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15,
        color: h ? 'var(--molten)' : 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid ' + (h ? 'var(--molten)' : 'var(--rule-soft)'),
        paddingBottom: 2, transition: 'color var(--dur-hover) var(--ease-soft), border-color var(--dur-hover) var(--ease-soft)', ...style }}>
      {children}<span aria-hidden="true">{arrow}</span>
    </a>
  );
}

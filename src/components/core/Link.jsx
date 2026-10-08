import React from 'react';

export function Link({ href = '#', variant = 'default', size = 'inherit', underline = 'hover', external = false, rightIcon, children, style, ...rest }) {
  const [h, setH] = React.useState(false);
  const color = variant === 'muted' ? (h ? 'var(--ink)' : 'var(--muted)') : (h ? 'var(--molten)' : 'var(--ink)');
  const line = underline === 'always' || (underline === 'hover' && h) || variant === 'primary';
  const fs = { sm: 13, md: 15, lg: 17 }[size] || 'inherit';
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} {...rest}
      style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4, fontSize: fs, fontWeight: variant === 'primary' ? 600 : 'inherit', color, textDecoration: 'none',
        borderBottom: '1px solid ' + (line ? (variant === 'primary' && !h ? 'var(--rule-soft)' : 'currentColor') : 'transparent'),
        transition: 'color var(--dur-hover) var(--ease-soft), border-color var(--dur-hover) var(--ease-soft)', ...style }}>
      {children}
      {(rightIcon || external) && <span aria-hidden="true">{rightIcon || '\u2197'}</span>}
    </a>
  );
}

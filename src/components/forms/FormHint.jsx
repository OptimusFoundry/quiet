import React from 'react';
import './FormHint.scss';

export function FormHint({ variant = 'default', icon, hidden = false, id, children, className, style }) {
  // Fade in only when the hint appears or changes variant after the first render.
  const first = React.useRef(hidden || !children ? '' : variant).current;
  if (hidden || !children) return null;
  const glyph = icon === true || (icon === undefined && variant !== 'default') ? { error: '!', success: '\u2713', default: 'i' }[variant] : icon || null;
  const cls = ['q-form-hint', 'q-form-hint--' + variant, variant !== first && 'q-anim-fade', className].filter(Boolean).join(' ');
  return (
    <span key={variant} id={id} role={variant === 'error' ? 'alert' : undefined} className={cls} data-state="open" style={style}>
      {glyph && <span aria-hidden="true" className="q-form-hint__glyph">{glyph}</span>}
      <span>{children}</span>
    </span>
  );
}

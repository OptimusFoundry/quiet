import React from 'react';

export function FormHint({ variant = 'default', icon, hidden = false, id, children, style }) {
  // Fade in only when the hint appears or changes variant after the first render.
  const first = React.useRef(hidden || !children ? '' : variant).current;
  if (hidden || !children) return null;
  const color = variant === 'error' ? 'var(--molten)' : variant === 'success' ? 'var(--ink)' : 'var(--muted)';
  const glyph = icon === true || (icon === undefined && variant !== 'default') ? { error: '!', success: '\u2713', default: 'i' }[variant] : icon || null;
  return (
    <span key={variant} id={id} role={variant === 'error' ? 'alert' : undefined} className={variant !== first ? 'q-anim-fade' : undefined} data-state="open" style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, lineHeight: 1.5, letterSpacing: '0.04em', color, ...style }}>
      {glyph && <span aria-hidden="true" style={{ flex: 'none', width: 14, height: 14, borderRadius: 999, border: '1px solid currentColor', display: 'inline-grid', placeItems: 'center', fontSize: 9, lineHeight: 1, transform: 'translateY(2px)' }}>{glyph}</span>}
      <span>{children}</span>
    </span>
  );
}

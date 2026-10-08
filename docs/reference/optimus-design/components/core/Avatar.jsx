import React from 'react';

const SIZES = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64, '2xl': 96 };

export function Avatar({ src, name, alt, size = 'md', shape = 'circle', fallback, style }) {
  const [err, setErr] = React.useState(false);
  const px = typeof size === 'number' ? size : SIZES[size] || 40;
  const initials = name ? name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() : null;
  const showImg = src && !err;
  return (
    <span title={name} style={{ width: px, height: px, flex: 'none', display: 'inline-grid', placeItems: 'center', overflow: 'hidden', boxSizing: 'border-box',
      borderRadius: shape === 'square' ? 'var(--radius-md)' : 999, background: showImg ? 'var(--paper-2)' : 'var(--paper-2)', border: '1px solid var(--rule-soft)',
      fontFamily: 'var(--font-mono)', fontSize: Math.max(9, Math.round(px * 0.34)), letterSpacing: '0.04em', color: 'var(--ink)', lineHeight: 1, ...style }}>
      {showImg ? <img src={src} alt={alt || name || ''} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : initials ?? fallback ?? <span aria-hidden="true" style={{ color: 'var(--muted-2)' }}>{'\u00b7'}</span>}
    </span>
  );
}

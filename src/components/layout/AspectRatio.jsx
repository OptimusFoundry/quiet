import React from 'react';

const PRESETS = { square: 1, video: 16 / 9, portrait: 3 / 4, wide: 21 / 9, photo: 4 / 3 };

export function AspectRatio({ ratio = 'video', label, children, style }) {
  const r = PRESETS[ratio] ?? ratio;
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: String(r), overflow: 'hidden', borderRadius: 'var(--radius-lg)', background: children ? 'transparent' : 'var(--paper-2)', border: children ? 'none' : '1px dashed var(--muted-2)', boxSizing: 'border-box', ...style }}>
      {children ? <div style={{ position: 'absolute', inset: 0, display: 'grid' }}>{React.Children.map(children, c => React.isValidElement(c) && (c.type === 'img' || c.type === 'video') ? React.cloneElement(c, { style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...(c.props.style || {}) } }) : c)}</div>
        : <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label || (typeof ratio === 'string' ? ratio : '') + ' \u00b7 ' + (Math.round(r * 100) / 100)}</span>}
    </div>
  );
}

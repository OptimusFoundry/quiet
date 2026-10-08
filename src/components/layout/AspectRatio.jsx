import React from 'react';
import './AspectRatio.scss';

const PRESETS = { square: 1, video: 16 / 9, portrait: 3 / 4, wide: 21 / 9, photo: 4 / 3 };

export function AspectRatio({ ratio = 'video', label, children, className, style }) {
  const preset = typeof ratio === 'string' && ratio in PRESETS;
  const r = PRESETS[ratio] ?? ratio;
  const cls = ['q-aspect-ratio', preset && 'q-aspect-ratio--' + ratio, !children && 'q-aspect-ratio--empty', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ ...(!preset && { '--_ratio': String(r) }), ...style }}>
      {children ? <div className="q-aspect-ratio__media">{children}</div>
        : <span className="q-aspect-ratio__label">{label || (typeof ratio === 'string' ? ratio : '') + ' · ' + (Math.round(r * 100) / 100)}</span>}
    </div>
  );
}

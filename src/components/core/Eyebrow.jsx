import React from 'react';
import './Eyebrow.scss';

export function Eyebrow({ index, children, tone = 'muted', className, style }) {
  return (
    <div className={['q-eyebrow', tone === 'ink' && 'q-eyebrow--ink', className].filter(Boolean).join(' ')} style={style}>
      {index != null && <span className="q-eyebrow__index">{index}</span>}
      <span>{children}</span>
    </div>
  );
}

import React from 'react';
import './StatusDot.scss';

export function StatusDot({ label, status = 'live', className, style }) {
  const mod = status === 'live' || status === 'prototype' ? 'q-status-dot--' + status : null;
  return (
    <span className={['q-status-dot', mod, className].filter(Boolean).join(' ')} style={style}>
      <span aria-hidden="true" className="q-status-dot__dot" />
      {label ?? status}
    </span>
  );
}

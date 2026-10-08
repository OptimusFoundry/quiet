import React from 'react';
import './Stat.scss';

export function Stat({ value, label, className, style }) {
  return (
    <div className={['q-stat', className].filter(Boolean).join(' ')} style={style}>
      <div className="q-stat__value">{value}</div>
      <div className="q-stat__label">{label}</div>
    </div>
  );
}

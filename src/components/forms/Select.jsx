import React from 'react';
import './Select.scss';

export function Select({ label, options = [], className, style, ...rest }) {
  return (
    <label className="q-select" style={style}>
      {label && <span className="q-select__label">{label}</span>}
      <span className="q-select__control">
        <select {...rest} className={['q-select__input', className].filter(Boolean).join(' ')}>
          {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span aria-hidden="true" className="q-select__chevron">{'\u2193'}</span>
      </span>
    </label>
  );
}

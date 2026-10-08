import React from 'react';
import './Spinner.scss';

const SIZES = { xs: 12, sm: 16, md: 24, lg: 32, xl: 48 };
const TONES = ['default', 'muted', 'paper', 'molten'];

export function Spinner({ size = 'md', tone = 'default', label, className, style, ...rest }) {
  const numeric = typeof size === 'number';
  const px = numeric ? size : SIZES[size] || 24;
  const knownTone = TONES.includes(tone);
  const cls = ['q-spinner', numeric ? null : 'q-spinner--' + (SIZES[size] ? size : 'md'), px >= 32 && 'q-spinner--thick',
    'q-spinner--' + (knownTone ? tone : 'custom-tone'), className].filter(Boolean).join(' ');
  const vars = {};
  if (numeric) vars['--_size'] = px + 'px';
  if (!knownTone) vars['--_tone'] = tone;
  return (
    <span role="status" aria-label={label || 'Loading'} {...rest} className={cls} style={numeric || !knownTone ? { ...vars, ...style } : style}>
      <span className="q-spinner__ring" />
      {label && <span className="q-spinner__label">{label}</span>}
    </span>
  );
}

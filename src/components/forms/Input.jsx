import React from 'react';
import './Input.scss';

export function Input({ label, hint, error, multiline = false, className, style, ...rest }) {
  const El = multiline ? 'textarea' : 'input';
  const uid = React.useId();
  const first = React.useRef(error ? 'e' : hint ? 'h' : '').current;
  const shown = error ? 'e' : hint ? 'h' : '';
  return (
    <label className="q-input" style={style}>
      {label && <span className="q-input__label">{label}</span>}
      <El aria-invalid={!!error || undefined} aria-describedby={error || hint ? uid + 'h' : undefined} {...rest}
        className={['q-input__field', multiline && 'q-input__field--multiline', error && 'q-input__field--invalid', className].filter(Boolean).join(' ')} />
      {(error || hint) && <span key={shown} id={uid + 'h'} className={'q-input__hint' + (error ? ' q-input__hint--error' : '') + (shown !== first ? ' q-anim-fade' : '')} data-state="open">{error || hint}</span>}
    </label>
  );
}

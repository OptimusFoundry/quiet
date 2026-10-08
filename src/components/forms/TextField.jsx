import React from 'react';
import { Label } from './Label';
import { FormHint } from './FormHint';
import './TextField.scss';

const SIZES = ['sm', 'md', 'lg'];
let ofTfId = 0;

export function TextField({ label, hideLabel = false, required, helperText, error, leftIcon, rightIcon, variant = 'default', size = 'md', disabled, id, className, style, inputStyle, ...rest }) {
  const [auto] = React.useState(() => 'of-tf-' + (++ofTfId));
  const fid = id || auto;
  const cls = ['q-text-field', 'q-text-field--' + (SIZES.includes(size) ? size : 'md'), variant === 'filled' && 'q-text-field--filled', error && 'q-text-field--invalid',
    disabled && 'q-text-field--disabled'].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      {label && <Label htmlFor={fid} required={required} size={size} className={hideLabel ? 'q-sr-only' : undefined}>{label}</Label>}
      <div className="q-text-field__field">
        {leftIcon && <span aria-hidden="true" className="q-text-field__icon">{leftIcon}</span>}
        <input id={fid} disabled={disabled} required={required} aria-invalid={!!error || undefined} aria-describedby={error || helperText ? fid + '-hint' : undefined} {...rest}
          className={['q-text-field__input', className].filter(Boolean).join(' ')} style={inputStyle} />
        {rightIcon && <span className="q-text-field__icon">{rightIcon}</span>}
      </div>
      <FormHint id={fid + '-hint'} variant={error ? 'error' : 'default'}>{error || helperText}</FormHint>
    </div>
  );
}

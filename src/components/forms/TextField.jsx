import React from 'react';
import { Label } from './Label';
import { FormHint } from './FormHint';

const SIZES = { sm: { h: 36, fs: 15, px: 12 }, md: { h: 48, fs: 17, px: 16 }, lg: { h: 56, fs: 19, px: 20 } };
let ofTfId = 0;

export function TextField({ label, hideLabel = false, required, helperText, error, leftIcon, rightIcon, variant = 'default', size = 'md', disabled, id, style, inputStyle, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const [auto] = React.useState(() => 'of-tf-' + (++ofTfId));
  const fid = id || auto;
  const sz = SIZES[size] || SIZES.md;
  const filled = variant === 'filled';
  const border = error ? 'var(--molten)' : focus ? 'var(--ink)' : filled ? 'var(--paper-2)' : 'var(--rule-soft)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: disabled ? 0.4 : 1, ...style }}>
      {label && <Label htmlFor={fid} required={required} size={size} style={hideLabel ? { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' } : undefined}>{label}</Label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: sz.h, padding: '0 ' + sz.px + 'px', boxSizing: 'border-box',
        background: filled && !focus ? 'var(--paper-2)' : 'var(--paper)', border: '1px solid ' + border, borderRadius: 'var(--radius-md)', boxShadow: focus ? 'var(--ring-focus)' : 'none',
        transition: 'border-color var(--dur-hover) var(--ease-soft), background var(--dur-hover) var(--ease-soft)' }}>
        {leftIcon && <span aria-hidden="true" style={{ display: 'inline-flex', color: 'var(--muted)', flex: 'none' }}>{leftIcon}</span>}
        <input id={fid} disabled={disabled} required={required} aria-invalid={!!error || undefined} aria-describedby={error || helperText ? fid + '-hint' : undefined} {...rest}
          onFocus={e => { setFocus(true); rest.onFocus && rest.onFocus(e); }} onBlur={e => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
          style={{ flex: 1, minWidth: 0, height: '100%', border: 0, outline: 'none', background: 'transparent', padding: 0, fontFamily: 'var(--font-sans)', fontSize: sz.fs, color: 'var(--ink)', cursor: disabled ? 'not-allowed' : undefined, ...inputStyle }} />
        {rightIcon && <span style={{ display: 'inline-flex', color: 'var(--muted)', flex: 'none' }}>{rightIcon}</span>}
      </div>
      <FormHint id={fid + '-hint'} variant={error ? 'error' : 'default'}>{error || helperText}</FormHint>
    </div>
  );
}

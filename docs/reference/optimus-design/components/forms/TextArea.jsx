import React from 'react';
import { Label } from './Label';
import { FormHint } from './FormHint';

const SIZES = { sm: { fs: 15, p: '8px 12px' }, md: { fs: 17, p: '12px 16px' }, lg: { fs: 19, p: '16px 20px' } };
let ofTaId = 0;

export function TextArea({ label, required, helperText, error, size = 'md', rows = 4, resize = 'vertical', maxLength, disabled, id, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const [len, setLen] = React.useState((rest.value ?? rest.defaultValue ?? '').length);
  const [auto] = React.useState(() => 'of-ta-' + (++ofTaId));
  const fid = id || auto;
  const sz = SIZES[size] || SIZES.md;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, opacity: disabled ? 0.4 : 1, ...style }}>
      {label && <Label htmlFor={fid} required={required} size={size}>{label}</Label>}
      <textarea id={fid} rows={rows} disabled={disabled} required={required} maxLength={maxLength} aria-invalid={!!error || undefined} {...rest}
        onChange={e => { setLen(e.target.value.length); rest.onChange && rest.onChange(e); }}
        onFocus={e => { setFocus(true); rest.onFocus && rest.onFocus(e); }} onBlur={e => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
        style={{ fontFamily: 'var(--font-sans)', fontSize: sz.fs, lineHeight: 1.55, color: 'var(--ink)', background: 'var(--paper)', padding: sz.p, boxSizing: 'border-box', width: '100%',
          border: '1px solid ' + (error ? 'var(--molten)' : focus ? 'var(--ink)' : 'var(--rule-soft)'), borderRadius: 'var(--radius-md)', boxShadow: focus ? 'var(--ring-focus)' : 'none', outline: 'none', resize,
          cursor: disabled ? 'not-allowed' : undefined, transition: 'border-color var(--dur-hover) var(--ease-soft)' }} />
      {(error || helperText || maxLength) && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <FormHint variant={error ? 'error' : 'default'}>{error || helperText}</FormHint>
        {maxLength && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>{len} / {maxLength}</span>}
      </div>}
    </div>
  );
}

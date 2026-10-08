import React from 'react';
import { Label } from './Label';
import { FormHint } from './FormHint';

let ofFieldId = 0;
export function FormField({ label, id, required, subText, helperText, error, size = 'md', children, style }) {
  const [auto] = React.useState(() => 'of-field-' + (++ofFieldId));
  const fid = id || auto;
  const hintId = fid + '-hint';
  const child = React.isValidElement(children) && typeof children.type === 'string'
    ? React.cloneElement(children, { id: fid, 'aria-invalid': !!error || undefined, 'aria-describedby': error || helperText ? hintId : undefined })
    : children;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label && <Label htmlFor={fid} required={required} subText={subText} size={size}>{label}</Label>}
      {child}
      <FormHint id={hintId} variant={error ? 'error' : 'default'}>{error || helperText}</FormHint>
    </div>
  );
}

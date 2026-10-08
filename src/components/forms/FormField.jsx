import React from 'react';
import { Label } from './Label';
import { FormHint } from './FormHint';
import './FormField.scss';

let ofFieldId = 0;
export function FormField({ label, id, required, subText, helperText, error, size = 'md', children, className, style }) {
  const [auto] = React.useState(() => 'of-field-' + (++ofFieldId));
  const fid = id || auto;
  const hintId = fid + '-hint';
  const described = [children && children.props && children.props['aria-describedby'], error || helperText ? hintId : null].filter(Boolean).join(' ') || undefined;
  const child = React.isValidElement(children) && (typeof children.type === 'string' || children.type.fieldControl)
    ? React.cloneElement(children, { id: fid, 'aria-invalid': !!error || undefined, 'aria-describedby': described, 'aria-required': required || undefined })
    : children;
  return (
    <div className={['q-form-field', className].filter(Boolean).join(' ')} style={style}>
      {label && <Label htmlFor={fid} required={required} subText={subText} size={size}>{label}</Label>}
      {child}
      <FormHint id={hintId} variant={error ? 'error' : 'default'}>{error || helperText}</FormHint>
    </div>
  );
}

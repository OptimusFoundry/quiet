import React from 'react';
import './Checkbox.scss';

const SIZES = ['sm', 'md', 'lg'];

export function Checkbox({ label, description, checked, defaultChecked = false, indeterminate = false, onChange, disabled, error, size = 'md', 'aria-label': ariaLabel, className, style }) {
  const [inner, setInner] = React.useState(defaultChecked);
  const uid = React.useId();
  const on = checked ?? inner;
  const toggle = () => { if (disabled) return; setInner(!on); onChange && onChange(!on); };
  const described = [description && uid + 'd', typeof error === 'string' && uid + 'e'].filter(Boolean).join(' ') || undefined;
  const cls = ['q-checkbox', 'q-checkbox--' + (SIZES.includes(size) ? size : 'md'), label && 'q-checkbox--labelled', disabled && 'q-checkbox--disabled', className].filter(Boolean).join(' ');
  return (
    <label className={cls} style={style}>
      <span role="checkbox" aria-checked={indeterminate ? 'mixed' : on} aria-invalid={!!error || undefined} aria-labelledby={label ? uid + 'l' : undefined} aria-label={label ? undefined : ariaLabel} aria-describedby={described}
        aria-disabled={disabled || undefined} tabIndex={disabled ? -1 : 0} onClick={toggle}
        onKeyDown={e => e.key === ' ' && (e.preventDefault(), toggle())} className="q-checkbox__box">
        <span aria-hidden="true" className="q-checkbox__mark">{indeterminate ? '\u2212' : '\u2713'}</span>
      </span>
      {(label || description || error) && <span onClick={toggle} className="q-checkbox__text">
        {label && <span id={uid + 'l'}>{label}</span>}
        {description && <span id={uid + 'd'} className="q-checkbox__description">{description}</span>}
        {typeof error === 'string' && <span id={uid + 'e'} className="q-checkbox__error">{error}</span>}
      </span>}
    </label>
  );
}

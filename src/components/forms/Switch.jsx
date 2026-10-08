import React from 'react';
import { useMergedRef } from '../../a11y/hooks';
import { FormValue } from '../../a11y/form';
import './Switch.scss';

const SIZES = ['sm', 'md', 'lg'];

export function Switch({ label, description, checked, defaultChecked = false, onChange, disabled, size = 'md', labelPosition = 'right', name, value = 'on', required, form, ref, 'aria-label': ariaLabel, className, style }) {
  const track = React.useRef(null);
  const trackRef = useMergedRef(track, ref);
  const [inner, setInner] = React.useState(defaultChecked);
  const uid = React.useId();
  const on = checked ?? inner;
  const toggle = () => { if (disabled) return; setInner(!on); onChange && onChange(!on); };
  const text = (label || description) && (
    <span onClick={toggle} className="q-switch__text">
      {label && <span id={uid + 'l'}>{label}</span>}
      {description && <span id={uid + 'd'} className="q-switch__description">{description}</span>}
    </span>
  );
  const cls = ['q-switch', 'q-switch--' + (SIZES.includes(size) ? size : 'md'), description && 'q-switch--described', labelPosition === 'left' && 'q-switch--label-left',
    disabled && 'q-switch--disabled', className].filter(Boolean).join(' ');
  return (
    <label className={cls} style={style}>
      {labelPosition === 'left' && text}
      <span ref={trackRef} role="switch" aria-checked={on} aria-required={required || undefined} aria-labelledby={label ? uid + 'l' : undefined} aria-label={label ? undefined : ariaLabel} aria-describedby={description ? uid + 'd' : undefined} aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0} onClick={toggle} onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle())} className="q-switch__track">
        <span className="q-switch__thumb" />
      </span>
      {labelPosition !== 'left' && text}
      <FormValue name={name} value={value} checked={on} required={required} disabled={disabled} form={form} focusTarget={() => track.current} />
    </label>
  );
}

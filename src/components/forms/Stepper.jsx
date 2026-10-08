import React from 'react';
import { motionToken } from '../../a11y/hooks';
import './Stepper.scss';

const SIZES = ['sm', 'md', 'lg'];

function StepBtn({ children, onClick, disabled, off, label }) {
  return (
    <button type="button" aria-label={label} onClick={off ? undefined : onClick} disabled={disabled} aria-disabled={off || undefined} tabIndex={-1} className="q-stepper__button">{children}</button>
  );
}

export function Stepper({ value, defaultValue, min = -Infinity, max = Infinity, step = 1, onChange, size = 'md', disabled = false, label, id, 'aria-describedby': describedBy, 'aria-invalid': invalid, 'aria-required': required, className, style }) {
  const [inner, setInner] = React.useState(defaultValue ?? (Number.isFinite(min) ? min : 0));
  const [said, setSaid] = React.useState('');
  const field = React.useRef(null);
  const cur = value ?? inner;
  const set = v => { const n = Math.min(max, Math.max(min, v)); setInner(n); onChange && onChange(n); return n; };
  const nudge = (v, say) => {
    const n = set(v); if (say) setSaid(String(n));
    const el = field.current;
    if (el && el.animate && n !== cur && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      el.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: motionToken(el, '--q-dur-enter'), easing: motionToken(el, '--q-ease-soft') });
  };
  const key = e => {
    const to = { ArrowUp: cur + step, ArrowDown: cur - step, PageUp: cur + step * 10, PageDown: cur - step * 10, Home: Number.isFinite(min) ? min : null, End: Number.isFinite(max) ? max : null }[e.key];
    if (to === undefined || to === null) return;
    e.preventDefault(); nudge(to);
  };
  const cls = ['q-stepper', 'q-stepper--' + (SIZES.includes(size) ? size : 'md'), disabled && 'q-stepper--disabled', className].filter(Boolean).join(' ');
  return (
    <div role="group" aria-label={label} className={cls} style={style}>
      <StepBtn label={label ? 'Decrease ' + label : 'Decrease'} disabled={disabled} off={disabled || cur - step < min} onClick={() => nudge(cur - step, true)}>{'\u2212'}</StepBtn>
      {/* --_chars sizes the field to its value (min 40px) */}
      <input ref={field} id={id} type="text" inputMode="numeric" role="spinbutton" aria-label={label} value={cur} disabled={disabled}
        aria-valuenow={cur} aria-valuemin={Number.isFinite(min) ? min : undefined} aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-describedby={describedBy} aria-invalid={invalid} aria-required={required} onKeyDown={key}
        onChange={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) set(n); }}
        className="q-stepper__field" style={{ '--_chars': String(cur).length }} />
      <StepBtn label={label ? 'Increase ' + label : 'Increase'} disabled={disabled} off={disabled || cur + step > max} onClick={() => nudge(cur + step, true)}>+</StepBtn>
      <span className="q-sr-only" aria-live="polite">{said}</span>
    </div>
  );
}
Stepper.fieldControl = true;

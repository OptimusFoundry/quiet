import React from 'react';
import { rovingKeyDown } from '../../a11y/hooks';
import './Radio.scss';

const SIZES = ['sm', 'md', 'lg'];

export function Radio({ name, label, 'aria-label': ariaLabel, options = [], value, defaultValue, onChange, direction = 'column', size = 'md', disabled = false, error, className, style }) {
  const first = options.find(o => !(o && o.disabled));
  const [inner, setInner] = React.useState(defaultValue ?? (first && (first.value ?? first)));
  const uid = React.useId();
  const cur = value ?? inner;
  const vals = options.map(o => (typeof o === 'string' ? o : o.value));
  const curOn = options.some(o => (typeof o === 'string' ? o : o.value) === cur && !disabled && !(o && o.disabled));
  const stop = curOn ? cur : first && !disabled ? (first.value ?? first) : undefined;
  const cls = ['q-radio', 'q-radio--' + (SIZES.includes(size) ? size : 'md'), className].filter(Boolean).join(' ');
  return (
    <div role="radiogroup" aria-label={label ? undefined : ariaLabel} aria-labelledby={label ? uid + 'g' : undefined} aria-disabled={disabled || undefined}
      aria-invalid={!!error || undefined} aria-describedby={typeof error === 'string' ? uid + 'e' : undefined} className={cls} style={style}>
      {label && <div id={uid + 'g'} className="q-radio__label">{label}</div>}
      <div onKeyDown={rovingKeyDown('[role="radio"]', 'both', { activate: true })} className={'q-radio__options' + (direction === 'row' ? ' q-radio__options--row' : '')}
        style={direction === 'row' || direction === 'column' ? undefined : { '--_direction': direction }}>
        {options.map((o, i) => {
          const v = vals[i]; const l = typeof o === 'string' ? o : o.label;
          const off = disabled || (o && o.disabled);
          const on = v === cur;
          const pick = () => { if (off) return; setInner(v); onChange && onChange(v); };
          return (
            <label key={v} onClick={pick} className={'q-radio__option' + (off ? ' q-radio__option--disabled' : '')}>
              <span role="radio" aria-checked={on} aria-labelledby={uid + i} aria-describedby={o && o.description ? uid + i + 'd' : undefined} aria-disabled={off || undefined}
                tabIndex={v === stop ? 0 : -1} onKeyDown={e => e.key === ' ' && (e.preventDefault(), pick())} className="q-radio__control">
                <span className="q-radio__dot" />
              </span>
              <span className="q-radio__text">
                <span id={uid + i}>{l}</span>
                {o && o.description && <span id={uid + i + 'd'} className="q-radio__description">{o.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {typeof error === 'string' && <span id={uid + 'e'} className="q-radio__error">{error}</span>}
    </div>
  );
}

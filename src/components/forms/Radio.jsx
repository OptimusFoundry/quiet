import React from 'react';
import { rovingKeyDown } from '../../a11y/hooks';

const SIZES = { sm: 14, md: 16, lg: 20 };

export function Radio({ name, label, 'aria-label': ariaLabel, options = [], value, defaultValue, onChange, direction = 'column', size = 'md', disabled = false, error, style }) {
  const first = options.find(o => !(o && o.disabled));
  const [inner, setInner] = React.useState(defaultValue ?? (first && (first.value ?? first)));
  const uid = React.useId();
  const cur = value ?? inner;
  const px = SIZES[size] || 16;
  const vals = options.map(o => (typeof o === 'string' ? o : o.value));
  const curOn = options.some(o => (typeof o === 'string' ? o : o.value) === cur && !disabled && !(o && o.disabled));
  const stop = curOn ? cur : first && !disabled ? (first.value ?? first) : undefined;
  return (
    <div role="radiogroup" aria-label={label ? undefined : ariaLabel} aria-labelledby={label ? uid + 'g' : undefined} aria-disabled={disabled || undefined}
      aria-invalid={!!error || undefined} aria-describedby={typeof error === 'string' ? uid + 'e' : undefined} style={{ display: 'flex', flexDirection: 'column', gap: 12, ...style }}>
      {label && <div id={uid + 'g'} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</div>}
      <div onKeyDown={rovingKeyDown('[role="radio"]', 'both', { activate: true })} style={{ display: 'flex', flexDirection: direction, flexWrap: 'wrap', gap: direction === 'row' ? 24 : 12 }}>
        {options.map((o, i) => {
          const v = vals[i]; const l = typeof o === 'string' ? o : o.label;
          const off = disabled || (o && o.disabled);
          const on = v === cur;
          const pick = () => { if (off) return; setInner(v); onChange && onChange(v); };
          return (
            <label key={v} onClick={pick} style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 12, cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.4 : 1, fontSize: size === 'lg' ? 17 : size === 'sm' ? 13 : 15, lineHeight: 1.4, color: 'var(--ink)' }}>
              <span role="radio" aria-checked={on} aria-labelledby={uid + i} aria-describedby={o && o.description ? uid + i + 'd' : undefined} aria-disabled={off || undefined}
                tabIndex={v === stop ? 0 : -1} onKeyDown={e => e.key === ' ' && (e.preventDefault(), pick())}
                style={{ width: px, height: px, flex: 'none', marginTop: 2, borderRadius: 999, border: '1px solid ' + (error ? 'var(--molten)' : 'var(--ink)'), display: 'grid', placeItems: 'center', boxSizing: 'border-box' }}>
                <span style={{ width: px / 2, height: px / 2, borderRadius: 999, background: 'var(--ink)', opacity: on ? 1 : 0, transform: on ? 'none' : 'scale(0.4)', transition: 'opacity var(--dur-hover) var(--ease-soft), transform var(--dur-hover) var(--ease-soft)' }} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span id={uid + i}>{l}</span>
                {o && o.description && <span id={uid + i + 'd'} style={{ fontSize: 13, color: 'var(--muted)' }}>{o.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {typeof error === 'string' && <span id={uid + 'e'} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--molten)' }}>{error}</span>}
    </div>
  );
}

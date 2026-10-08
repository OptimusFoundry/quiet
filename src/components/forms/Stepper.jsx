import React from 'react';

const SIZES = { sm: { h: 32, w: 32, fs: 13 }, md: { h: 40, w: 40, fs: 15 }, lg: { h: 48, w: 48, fs: 17 } };

function StepBtn({ children, onClick, disabled, off, sz, label }) {
  const [h, setH] = React.useState(false);
  return (
    <button type="button" aria-label={label} onClick={off ? undefined : onClick} disabled={disabled} aria-disabled={off || undefined} tabIndex={-1} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: sz.w, height: '100%', border: 0, background: h && !off ? 'var(--paper-2)' : 'transparent', color: off ? 'var(--muted-2)' : 'var(--ink)',
        cursor: off ? 'not-allowed' : 'pointer', fontSize: sz.fs + 2, lineHeight: 1, transition: 'background var(--dur-hover) var(--ease-soft)' }}>{children}</button>
  );
}

export function Stepper({ value, defaultValue, min = -Infinity, max = Infinity, step = 1, onChange, size = 'md', disabled = false, label, id, 'aria-describedby': describedBy, 'aria-invalid': invalid, 'aria-required': required, style }) {
  const [inner, setInner] = React.useState(defaultValue ?? (Number.isFinite(min) ? min : 0));
  const [said, setSaid] = React.useState('');
  const field = React.useRef(null);
  const cur = value ?? inner;
  const sz = SIZES[size] || SIZES.md;
  const set = v => { const n = Math.min(max, Math.max(min, v)); setInner(n); onChange && onChange(n); return n; };
  const nudge = (v, say) => {
    const n = set(v); if (say) setSaid(String(n));
    const el = field.current;
    if (el && el.animate && n !== cur && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      el.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 220, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)' });
  };
  const key = e => {
    const to = { ArrowUp: cur + step, ArrowDown: cur - step, PageUp: cur + step * 10, PageDown: cur - step * 10, Home: Number.isFinite(min) ? min : null, End: Number.isFinite(max) ? max : null }[e.key];
    if (to === undefined || to === null) return;
    e.preventDefault(); nudge(to);
  };
  return (
    <div role="group" aria-label={label} style={{ display: 'inline-flex', alignItems: 'stretch', height: sz.h, border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', boxSizing: 'border-box', opacity: disabled ? 0.4 : 1, ...style }}>
      <StepBtn label={label ? 'Decrease ' + label : 'Decrease'} sz={sz} disabled={disabled} off={disabled || cur - step < min} onClick={() => nudge(cur - step, true)}>{'\u2212'}</StepBtn>
      <input ref={field} id={id} type="text" inputMode="numeric" role="spinbutton" aria-label={label} value={cur} disabled={disabled}
        aria-valuenow={cur} aria-valuemin={Number.isFinite(min) ? min : undefined} aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-describedby={describedBy} aria-invalid={invalid} aria-required={required} onKeyDown={key}
        onChange={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) set(n); }}
        style={{ width: Math.max(40, String(cur).length * 10 + 24), textAlign: 'center', border: 0, borderLeft: '1px solid var(--rule-soft)', borderRight: '1px solid var(--rule-soft)', outline: 'none',
          fontFamily: 'var(--font-mono)', fontSize: sz.fs - 1, color: 'var(--ink)', background: 'var(--paper)', fontVariantNumeric: 'tabular-nums' }} />
      <StepBtn label={label ? 'Increase ' + label : 'Increase'} sz={sz} disabled={disabled} off={disabled || cur + step > max} onClick={() => nudge(cur + step, true)}>+</StepBtn>
      <span className="q-sr-only" aria-live="polite">{said}</span>
    </div>
  );
}
Stepper.fieldControl = true;

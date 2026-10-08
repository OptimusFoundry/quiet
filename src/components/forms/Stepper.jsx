import React from 'react';

const SIZES = { sm: { h: 32, w: 32, fs: 13 }, md: { h: 40, w: 40, fs: 15 }, lg: { h: 48, w: 48, fs: 17 } };

function StepBtn({ children, onClick, disabled, sz, label }) {
  const [h, setH] = React.useState(false);
  return (
    <button type="button" aria-label={label} onClick={onClick} disabled={disabled} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: sz.w, height: '100%', border: 0, background: h && !disabled ? 'var(--paper-2)' : 'transparent', color: disabled ? 'var(--muted-2)' : 'var(--ink)',
        cursor: disabled ? 'not-allowed' : 'pointer', fontSize: sz.fs + 2, lineHeight: 1, transition: 'background var(--dur-hover) var(--ease-soft)' }}>{children}</button>
  );
}

export function Stepper({ value, defaultValue, min = -Infinity, max = Infinity, step = 1, onChange, size = 'md', disabled = false, label, style }) {
  const [inner, setInner] = React.useState(defaultValue ?? (Number.isFinite(min) ? min : 0));
  const cur = value ?? inner;
  const sz = SIZES[size] || SIZES.md;
  const set = v => { const n = Math.min(max, Math.max(min, v)); setInner(n); onChange && onChange(n); };
  return (
    <div role="group" aria-label={label} style={{ display: 'inline-flex', alignItems: 'stretch', height: sz.h, border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-pill)', overflow: 'hidden', boxSizing: 'border-box', opacity: disabled ? 0.4 : 1, ...style }}>
      <StepBtn label="Decrease" sz={sz} disabled={disabled || cur - step < min} onClick={() => set(cur - step)}>{'\u2212'}</StepBtn>
      <input type="text" inputMode="numeric" aria-label={label} value={cur} disabled={disabled}
        onChange={e => { const n = parseFloat(e.target.value); if (!isNaN(n)) set(n); }}
        style={{ width: Math.max(40, String(cur).length * 10 + 24), textAlign: 'center', border: 0, borderLeft: '1px solid var(--rule-soft)', borderRight: '1px solid var(--rule-soft)', outline: 'none',
          fontFamily: 'var(--font-mono)', fontSize: sz.fs - 1, color: 'var(--ink)', background: 'var(--paper)', fontVariantNumeric: 'tabular-nums' }} />
      <StepBtn label="Increase" sz={sz} disabled={disabled || cur + step > max} onClick={() => set(cur + step)}>+</StepBtn>
    </div>
  );
}

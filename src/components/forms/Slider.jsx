import React from 'react';

const SIZES = { sm: { t: 2, k: 12 }, md: { t: 2, k: 16 }, lg: { t: 4, k: 20 } };

export function Slider({ label, value, defaultValue, min = 0, max = 100, step = 1, onChange, showValue = true, formatValue, size = 'md', disabled = false, 'aria-label': ariaLabel, style }) {
  const [inner, setInner] = React.useState(defaultValue ?? min);
  const [focus, setFocus] = React.useState(false);
  const [glide, setGlide] = React.useState(false);
  const uid = React.useId();
  const cur = value ?? inner;
  const track = React.useRef(null);
  const sz = SIZES[size] || SIZES.md;
  const pct = max === min ? 0 : ((cur - min) / (max - min)) * 100;
  const set = v => {
    const c = Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min));
    const n = Number(c.toFixed(6));
    if (n !== cur) { setInner(n); onChange && onChange(n); }
  };
  const fromX = x => { const r = track.current.getBoundingClientRect(); set(min + ((x - r.left) / r.width) * (max - min)); };
  const down = e => { if (disabled) return; setGlide(false); e.currentTarget.setPointerCapture(e.pointerId); fromX(e.clientX); };
  const move = e => { if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return; fromX(e.clientX); };
  const key = e => {
    const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: step * 10, PageDown: -step * 10 }[e.key];
    const to = d ? cur + d : e.key === 'Home' ? min : e.key === 'End' ? max : null;
    if (to !== null && !disabled) { e.preventDefault(); setGlide(true); set(to); }
  };
  const fmt = formatValue || (v => v);
  const text = fmt(cur);
  const move2 = glide ? ' var(--dur-hover) var(--ease-soft)' : ' 0s';
  return (
    <div aria-disabled={disabled || undefined} style={{ display: 'flex', flexDirection: 'column', gap: 12, opacity: disabled ? 0.4 : 1, ...style }}>
      {(label || showValue) && <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
        <span id={uid + 'l'}>{label}</span>{showValue && <span aria-hidden="true" style={{ color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>{text}</span>}
      </div>}
      <div ref={track} onPointerDown={down} onPointerMove={move} style={{ position: 'relative', height: sz.k, cursor: disabled ? 'not-allowed' : 'pointer', touchAction: 'none' }}>
        <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: sz.t, transform: 'translateY(-50%)', borderRadius: 999, background: 'var(--rule-soft)' }} />
        <span style={{ position: 'absolute', left: 0, width: pct + '%', top: '50%', height: sz.t, transform: 'translateY(-50%)', borderRadius: 999, background: 'var(--ink)', transition: 'width' + move2 }} />
        <span role="slider" tabIndex={disabled ? -1 : 0} aria-valuemin={min} aria-valuemax={max} aria-valuenow={cur}
          aria-valuetext={typeof text === 'string' || typeof text === 'number' ? String(text) : undefined} aria-orientation="horizontal" aria-disabled={disabled || undefined}
          aria-labelledby={label ? uid + 'l' : undefined} aria-label={label ? undefined : ariaLabel}
          onKeyDown={key} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ position: 'absolute', top: 0, left: 'calc(' + pct + '% - ' + sz.k / 2 + 'px)', width: sz.k, height: sz.k, borderRadius: 999, background: 'var(--ink)',
            boxShadow: focus ? '0 0 0 3px var(--paper), 0 0 0 4px var(--ink)' : 'none', outline: 'none', transition: 'left' + move2 }} />
      </div>
    </div>
  );
}

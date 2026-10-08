import React from 'react';
import './ElasticSlider.scss';

// Past the safe line a pointer drag keeps only this share of its travel (it "loses leverage").
const LEVERAGE = 0.35;

export function ElasticSlider({ label, value, defaultValue, min = 0, max = 100, step = 1, safe, onChange,
  override, defaultOverride = false, onOverrideChange, overrideLabel = 'Hold override', overrideOnLabel = 'Override held',
  hint, overHint, formatValue, disabled = false, 'aria-label': ariaLabel, className, style }) {
  const limit = safe ?? max;
  const [inner, setInner] = React.useState(defaultValue ?? min);
  const [innerHeld, setInnerHeld] = React.useState(defaultOverride);
  const [glide, setGlide] = React.useState(false);
  const [stretch, setStretch] = React.useState(0); // how far the pointer pulled beyond where the thumb sits
  const [said, setSaid] = React.useState('');
  const uid = React.useId();
  const track = React.useRef(null);
  const cur = value ?? inner;
  const held = override ?? innerHeld;
  const over = cur > limit;
  const snap = v => Number(Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min)).toFixed(6));
  const commit = n => { if (n !== cur) { setInner(n); onChange && onChange(n); } };
  // Announce crossing the line, not every step.
  const wasOver = React.useRef(over);
  React.useEffect(() => { if (over !== wasOver.current) setSaid(over ? 'Past the safe line' : 'Back within the safe line'); wasOver.current = over; }, [over]);
  const fromX = x => {
    const r = track.current.getBoundingClientRect();
    const raw = min + Math.min(1, Math.max(0, (x - r.left) / r.width)) * (max - min);
    const eased = held || raw <= limit ? raw : limit + (raw - limit) * LEVERAGE;
    setStretch(held ? 0 : Math.max(0, raw - eased) / (max - min));
    commit(snap(eased));
  };
  const down = e => { if (disabled) return; setGlide(false); e.currentTarget.setPointerCapture(e.pointerId); fromX(e.clientX); };
  const move = e => { if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return; fromX(e.clientX); };
  const up = () => { setStretch(0); if (!held && cur > limit) { setGlide(true); commit(snap(limit)); } };
  const key = e => {
    const top = held ? max : limit;
    const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: step * 10, PageDown: -step * 10 }[e.key];
    const to = d ? cur + d : e.key === 'Home' ? min : e.key === 'End' ? top : null;
    if (to === null || disabled) return;
    e.preventDefault(); setGlide(true);
    if (to > top && d > 0) { if (cur < top) commit(snap(top)); else setSaid('Safe limit. Hold the override to go further.'); return; }
    commit(snap(Math.min(to, Math.max(top, cur))));
  };
  const toggleHeld = () => {
    const next = !held; setInnerHeld(next); onOverrideChange && onOverrideChange(next);
    if (!next && cur > limit) { setGlide(true); commit(snap(limit)); }
  };
  const fmt = formatValue || (v => v);
  const text = fmt(cur);
  const pct = v => (max === min ? 0 : (v - min) / (max - min));
  const cls = ['q-elastic-slider', className].filter(Boolean).join(' ');
  return (
    <div aria-disabled={disabled || undefined} data-over={over || undefined} className={cls}
      style={{ '--_t': pct(cur), '--_safe': pct(limit), '--_stretch': stretch, ...style }}>
      <div className="q-elastic-slider__header">
        <span id={uid + 'l'} className="q-elastic-slider__label">{label}</span>
        <span aria-hidden="true" className="q-elastic-slider__value">{text}</span>
      </div>
      <div ref={track} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        className="q-elastic-slider__track" data-glide={glide || undefined}>
        <span className="q-elastic-slider__rail" />
        <span className="q-elastic-slider__fill" />
        {safe != null && <span aria-hidden="true" className="q-elastic-slider__line" />}
        <span role="slider" tabIndex={disabled ? -1 : 0} aria-valuemin={min} aria-valuemax={max} aria-valuenow={cur}
          aria-valuetext={String(text) + (over ? ', past the safe line' : '')} aria-disabled={disabled || undefined}
          aria-labelledby={label ? uid + 'l' : undefined} aria-label={label ? undefined : ariaLabel} aria-describedby={uid + 'h'}
          onKeyDown={key} className="q-elastic-slider__thumb" />
      </div>
      <div className="q-elastic-slider__footer">
        <span id={uid + 'h'} className="q-elastic-slider__hint">{over ? overHint ?? hint : hint}</span>
        {safe != null && <button type="button" aria-pressed={held} disabled={disabled} onClick={toggleHeld} className="q-elastic-slider__override">
          <span aria-hidden="true" className="q-elastic-slider__lock" />{held ? overrideOnLabel : overrideLabel}
        </button>}
      </div>
      <span className="q-sr-only" role="status">{said}</span>
    </div>
  );
}

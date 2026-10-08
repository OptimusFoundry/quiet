import React from 'react';
import './ProbabilityToggle.scss';

export const PROBABILITY_LEVELS = [
  { upTo: 4, label: 'Off' },
  { upTo: 34, label: 'Rarely' },
  { upTo: 64, label: 'Sometimes' },
  { upTo: 95, label: 'Mostly' },
  { upTo: 100, label: 'Always' },
];
const TICKS = [25, 50, 75];

export function ProbabilityToggle({ label, levels = PROBABILITY_LEVELS, value, defaultValue = 0, onChange, step = 5, disabled = false, 'aria-label': ariaLabel, className, style }) {
  const [inner, setInner] = React.useState(defaultValue);
  const [glide, setGlide] = React.useState(false);
  const uid = React.useId();
  const track = React.useRef(null);
  const cur = value ?? inner;
  const levelAt = v => levels.find(l => v <= l.upTo) || levels[levels.length - 1];
  const level = levelAt(cur);
  const set = v => {
    const n = Math.min(100, Math.max(0, Math.round(v)));
    if (n !== cur) { setInner(n); onChange && onChange(n, levelAt(n)); }
  };
  const fromX = x => { const r = track.current.getBoundingClientRect(); set(((x - r.left) / r.width) * 100); };
  const down = e => { if (disabled) return; setGlide(false); e.currentTarget.setPointerCapture(e.pointerId); fromX(e.clientX); };
  const move = e => { if (disabled || !e.currentTarget.hasPointerCapture(e.pointerId)) return; fromX(e.clientX); };
  const key = e => {
    const d = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: 25, PageDown: -25 }[e.key];
    const to = d ? cur + d : e.key === 'Home' ? 0 : e.key === 'End' ? 100 : null;
    if (to !== null && !disabled) { e.preventDefault(); setGlide(true); set(to); }
  };
  const cls = ['q-probability-toggle', className].filter(Boolean).join(' ');
  return (
    <div aria-disabled={disabled || undefined} className={cls} style={{ '--_t': cur / 100, ...style }}>
      <div ref={track} onPointerDown={down} onPointerMove={move} className="q-probability-toggle__track" data-glide={glide || undefined}>
        <span className="q-probability-toggle__fill" />
        {TICKS.map(t => <span key={t} aria-hidden="true" className="q-probability-toggle__tick" style={{ '--_at': t / 100 }} />)}
        <span role="slider" tabIndex={disabled ? -1 : 0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={cur}
          aria-valuetext={level.label + ', ' + cur + '%'} aria-disabled={disabled || undefined}
          aria-labelledby={label ? uid + 'l' : undefined} aria-label={label ? undefined : ariaLabel}
          aria-describedby={level.description ? uid + 'd' : undefined}
          onKeyDown={key} className="q-probability-toggle__thumb" />
      </div>
      <div className="q-probability-toggle__text">
        <span className="q-probability-toggle__heading">
          {label && <span id={uid + 'l'} className="q-probability-toggle__label">{label}</span>}
          <span aria-hidden="true" className="q-probability-toggle__level">{level.label} · {cur}%</span>
        </span>
        {level.description && <span id={uid + 'd'} className="q-probability-toggle__description">{level.description}</span>}
      </div>
    </div>
  );
}

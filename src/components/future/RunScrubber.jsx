import React from 'react';
import './RunScrubber.scss';

// Scrub a finished agent run like a video, with what it was thinking at each frame. The thumb is a
// slider over the steps (arrows, Home/End, or drag); the panel below shows that step's state, and
// `actions` can offer to branch or correct from there.
export function RunScrubber({ steps = [], value, defaultValue = 0, onChange, label = 'Run', agent, caption, actions, className, style }) {
  const n = steps.length;
  const [inner, setInner] = React.useState(defaultValue);
  const cur = Math.min(Math.max(value ?? inner, 0), Math.max(n - 1, 0));
  const [glide, setGlide] = React.useState(true);
  const uid = React.useId();
  const track = React.useRef(null);
  const set = i => {
    const to = Math.min(Math.max(i, 0), n - 1);
    if (to !== cur) { setInner(to); onChange && onChange(to); }
  };
  const fromX = x => { const r = track.current.getBoundingClientRect(); set(Math.round(((x - r.left) / r.width) * (n - 1))); };
  const down = e => { if (n < 2) return; setGlide(false); e.currentTarget.setPointerCapture(e.pointerId); fromX(e.clientX); };
  const move = e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) fromX(e.clientX); };
  const key = e => {
    const to = { ArrowRight: cur + 1, ArrowUp: cur + 1, ArrowLeft: cur - 1, ArrowDown: cur - 1, PageUp: cur + 2, PageDown: cur - 2, Home: 0, End: n - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault(); setGlide(true); set(to);
  };
  const step = steps[cur];
  const pct = n > 1 ? (cur / (n - 1)) * 100 : 0;
  const text = step ? 'Step ' + (cur + 1) + ' of ' + n + ': ' + step.label : '';
  return (
    <div className={['q-run-scrubber', className].filter(Boolean).join(' ')} style={{ '--_pct': pct + '%', ...style }}>
      <div ref={track} onPointerDown={down} onPointerMove={move} className="q-run-scrubber__track" data-glide={glide || undefined}>
        <span className="q-run-scrubber__rail" />
        <span className="q-run-scrubber__fill" />
        {steps.map((s, i) => <span key={i} aria-hidden="true" className="q-run-scrubber__tick" data-past={i <= cur || undefined} style={{ '--_at': (n > 1 ? (i / (n - 1)) * 100 : 0) + '%' }} />)}
        <span role="slider" tabIndex={0} aria-label={label} aria-valuemin={1} aria-valuemax={n} aria-valuenow={cur + 1} aria-valuetext={text}
          aria-controls={uid + 'p'} onKeyDown={key} className="q-run-scrubber__thumb" />
      </div>
      <ol aria-hidden="true" className="q-run-scrubber__steps" style={{ '--_n': n }}>
        {steps.map((s, i) => (
          <li key={i} className="q-run-scrubber__step" aria-current={i === cur ? 'step' : undefined} onClick={() => { setGlide(true); set(i); }}>{s.label}</li>
        ))}
      </ol>
      {step && (
        <section id={uid + 'p'} aria-labelledby={uid + 'c'} className="q-run-scrubber__panel">
          {agent && <span aria-hidden="true" className="q-run-scrubber__agent">{agent}</span>}
          <div aria-live="polite" className="q-run-scrubber__body">
            <span id={uid + 'c'} className="q-run-scrubber__caption">{caption ? caption(cur, step) : 'Step ' + (cur + 1) + ' · ' + step.label}</span>
            <p key={cur} className="q-run-scrubber__detail">{step.detail}</p>
          </div>
        </section>
      )}
      {actions && <div className="q-run-scrubber__actions">{typeof actions === 'function' ? actions(cur, step) : actions}</div>}
    </div>
  );
}

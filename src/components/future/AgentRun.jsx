import React from 'react';
import { Button } from '../core/Button';
import { Spinner } from '../core/Spinner';
import './AgentRun.scss';

const STATE_TEXT = { done: 'done', running: 'running', paused: 'paused', waiting: 'waiting for you', stopped: 'stopped', queued: 'queued' };

function stepState(i, current, status, count) {
  if (status === 'done' || i < current) return 'done';
  if (i > current) return 'queued';
  if (status === 'stopped') return 'stopped';
  if (status === 'paused') return 'paused';
  return i === count - 1 ? 'waiting' : 'running';
}

// Work that takes seconds and touches real data, shown as named, timed, interruptible steps.
// The last step is always a person: when the run reaches it, its marker turns molten.
export function AgentRun({ title, meta, steps = [], current = 0, status = 'running', onPause, onResume, onTakeOver, onStop,
  actions, className, style }) {
  const uid = React.useId();
  const count = steps.length;
  const atHuman = status !== 'stopped' && current >= count - 1;
  const live = status === 'running' || status === 'paused';
  const now = steps[Math.min(current, count - 1)];
  const announce = status === 'stopped' ? 'Run stopped'
    : status === 'done' ? 'Run complete'
      : now ? `Step ${Math.min(current, count - 1) + 1} of ${count}: ${now.label}, ${STATE_TEXT[stepState(current, current, status, count)]}` : '';
  return (
    <section aria-labelledby={uid + 't'} aria-busy={status === 'running' && !atHuman || undefined}
      className={['q-agent-run', 'q-agent-run--' + status, className].filter(Boolean).join(' ')} style={style}>
      <header className="q-agent-run__header">
        <div className="q-agent-run__heading">
          <h3 id={uid + 't'} className="q-agent-run__title">{title}</h3>
          {meta && <div className="q-agent-run__meta">{meta}</div>}
        </div>
        {live && !atHuman && (
          <div className="q-agent-run__controls" role="group" aria-label="Run controls">
            {status === 'paused' ? onResume && <Button variant="ghost" size="sm" onClick={onResume}>Resume</Button>
              : onPause && <Button variant="ghost" size="sm" onClick={onPause}>Pause</Button>}
            {onTakeOver && <Button variant="ghost" size="sm" onClick={onTakeOver}>Take over</Button>}
            {onStop && <Button variant="destructive" size="sm" onClick={onStop}>Stop</Button>}
          </div>
        )}
      </header>
      <ol className="q-agent-run__steps">
        {steps.map((s, i) => {
          const st = stepState(i, current, status, count);
          const human = i === count - 1;
          return (
            <li key={s.id ?? i} aria-current={i === current && st !== 'done' ? 'step' : undefined}
              className={['q-agent-run__step', 'q-agent-run__step--' + st, human && 'q-agent-run__step--human'].filter(Boolean).join(' ')}>
              <span aria-hidden="true" className="q-agent-run__marker">
                {st === 'running' ? <Spinner size={12} label={null} aria-hidden="true" /> : <span className="q-agent-run__dot" />}
              </span>
              <span className="q-agent-run__label">{s.label}<span className="q-sr-only">, {STATE_TEXT[st]}</span></span>
              <span className="q-agent-run__aside">
                {s.tool && <span className="q-agent-run__tool">{s.tool}</span>}
                {s.duration && st === 'done' && <span className="q-agent-run__duration">{s.duration}</span>}
              </span>
            </li>
          );
        })}
      </ol>
      {atHuman && actions && <div className="q-agent-run__actions q-anim-rise" data-state="open">{actions}</div>}
      <span role="status" className="q-sr-only">{announce}</span>
    </section>
  );
}

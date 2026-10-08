import React from 'react';
import { Button } from '../core/Button';
import './DraftDiff.scss';

const quote = v => (typeof v === 'string' ? '“' + v + '”' : 'suggestion');

// Suggestions land inline as word-level hunks you accept or keep one at a time, instead of a
// regenerate that throws away what was right. Nothing ships while a hunk is still open.
export function DraftDiff({ hunks = [], value, defaultValue, onChange, label, note, shipLabel = 'Ship', onShip, className, style }) {
  const [inner, setInner] = React.useState(() => defaultValue ?? hunks.map(() => 'pending'));
  const states = value ?? inner;
  const set = next => { setInner(next); onChange && onChange(next); };
  const refs = React.useRef([]);
  const focusNext = React.useRef(null);
  React.useEffect(() => {
    if (focusNext.current == null) return;
    refs.current[focusNext.current]?.focus();
    focusNext.current = null;
  });
  const resolve = (i, v) => { focusNext.current = i; set(states.map((x, j) => (j === i ? v : x))); };
  const accepted = states.filter(s => s === 'accepted').length;
  const pending = states.filter(s => s === 'pending').length;
  const kept = states.length - accepted - pending;
  const uid = React.useId();
  return (
    <section aria-label={typeof label === 'string' ? label : 'Suggested edits'}
      className={['q-draft-diff', className].filter(Boolean).join(' ')} style={style}>
      <header className="q-draft-diff__header">
        <div className="q-draft-diff__heading">
          {label && <span className="q-draft-diff__label">{label}</span>}
          {note && <span className="q-draft-diff__note">{note}</span>}
        </div>
        <div className="q-draft-diff__bulk">
          <Button variant="ghost" size="sm" disabled={pending === 0} onClick={() => set(states.map(s => (s === 'pending' ? 'accepted' : s)))}>Accept all</Button>
          <Button variant="ghost" size="sm" disabled={pending === states.length} onClick={() => set(hunks.map(() => 'pending'))}>Reset</Button>
        </div>
      </header>
      <p className="q-draft-diff__text">
        {hunks.map((h, i) => {
          const st = states[i] ?? 'pending';
          return (
            <React.Fragment key={h.id ?? i}>
              {h.keep}
              {st === 'pending' ? (
                <span className="q-draft-diff__hunk">
                  <del className="q-draft-diff__before">{h.before}</del>{' '}
                  <ins className="q-draft-diff__after">{h.after}</ins>
                  <span className="q-draft-diff__choices">
                    <button type="button" ref={el => { refs.current[i] = el; }} className="q-draft-diff__choice q-draft-diff__choice--accept"
                      aria-label={'Accept ' + quote(h.after)} onClick={() => resolve(i, 'accepted')}><span aria-hidden="true">{'✓'}</span></button>
                    <button type="button" className="q-draft-diff__choice"
                      aria-label={'Keep ' + quote(h.before)} onClick={() => resolve(i, 'rejected')}><span aria-hidden="true">{'×'}</span></button>
                  </span>
                </span>
              ) : (
                <button type="button" ref={el => { refs.current[i] = el; }}
                  className={'q-draft-diff__resolved q-draft-diff__resolved--' + st}
                  aria-label={(st === 'accepted' ? 'Accepted ' + quote(h.after) : 'Kept ' + quote(h.before)) + '. Reconsider'}
                  onClick={() => resolve(i, 'pending')}>{st === 'accepted' ? h.after : h.before}</button>
              )}
              {h.tail}
            </React.Fragment>
          );
        })}
      </p>
      <footer className="q-draft-diff__footer">
        <span id={uid + 's'} role="status" className="q-draft-diff__summary">{accepted} accepted · {pending} pending · {kept} kept</span>
        <Button size="sm" disabled={pending > 0} aria-describedby={uid + 's'} onClick={onShip}>{shipLabel}</Button>
      </footer>
    </section>
  );
}

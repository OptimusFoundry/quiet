import React from 'react';
import { Badge } from '../core/Badge';
import { HoldButton } from './HoldButton';
import './Approval.scss';

const chip = (v, variant) => (typeof v === 'string' || typeof v === 'number' ? <Badge size="sm" variant={variant}>{v}</Badge> : v);

// Replaces "Are you sure?" with what will actually happen: each change as before → after, its
// reach, and how long it stays undoable. The commit is a HoldButton.
export function Approval({ title, description, changes = [], consequences = [], confirmLabel = 'Confirm', confirmedLabel = 'Done',
  onConfirm, holdDuration, secondaryAction, confirmed, className, style }) {
  const uid = React.useId();
  const [inner, setInner] = React.useState(false);
  const done = confirmed ?? inner;
  return (
    <section aria-labelledby={uid + 't'} aria-describedby={description ? uid + 'd' : undefined}
      className={['q-approval', className].filter(Boolean).join(' ')} style={style}>
      <header className="q-approval__header">
        <h3 id={uid + 't'} className="q-approval__title">{title}</h3>
        {description && <p id={uid + 'd'} className="q-approval__description">{description}</p>}
      </header>
      {changes.length > 0 && (
        <ul className="q-approval__changes" aria-label="Changes">
          {changes.map((c, i) => (
            <li key={c.id ?? i} className="q-approval__change">
              <span className="q-approval__change-label">{c.label}</span>
              <span className="q-approval__transition">
                {chip(c.before, 'secondary')}
                <span aria-hidden="true" className="q-approval__arrow">{'→'}</span>
                <span className="q-sr-only">to</span>
                {chip(c.after, 'outline')}
              </span>
              {c.meta != null && <span className="q-approval__change-meta">{c.meta}</span>}
            </li>
          ))}
        </ul>
      )}
      <footer className="q-approval__footer">
        {consequences.length > 0 && (
          <ul className="q-approval__consequences" aria-label="Consequences">
            {consequences.map((c, i) => (
              <li key={i} className="q-approval__consequence">
                {c.glyph && <span aria-hidden="true" className="q-approval__glyph">{c.glyph}</span>}{c.label ?? c}
              </li>
            ))}
          </ul>
        )}
        <div className="q-approval__actions">
          {!done && secondaryAction}
          <HoldButton size="sm" duration={holdDuration} confirmed={done} confirmedLabel={confirmedLabel}
            onConfirm={() => { setInner(true); onConfirm && onConfirm(); }}>{confirmLabel}</HoldButton>
        </div>
      </footer>
    </section>
  );
}

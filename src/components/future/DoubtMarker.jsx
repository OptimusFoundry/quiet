import React from 'react';
import { useEscape } from '../../a11y/hooks';
import './DoubtMarker.scss';

const STATUS_TEXT = { doubt: 'Unsure', checking: 'Re-checking', confirmed: 'Confirmed', revised: 'Revised' };

// An inline mark on a claim the system isn't sure of. Hover or focus explains why; with
// `onRecheck` the claim itself is the button that sends the system back to the data, which then
// confirms it or rewrites it in place (`status="revised"` + `revision`).
export function DoubtMarker({ children, reason, status = 'doubt', revision, confidence, onRecheck, recheckLabel = 'Re-check', className, style }) {
  const [open, setOpen] = React.useState(false);
  const t = React.useRef();
  const id = React.useId();
  const show = () => { clearTimeout(t.current); setOpen(true); };
  // A short grace period lets the pointer cross onto the bubble without it vanishing (WCAG 1.4.13).
  const leave = () => { clearTimeout(t.current); t.current = setTimeout(() => setOpen(false), 120); };
  const hide = () => { clearTimeout(t.current); setOpen(false); };
  React.useEffect(() => () => clearTimeout(t.current), []);
  useEscape(open, hide);

  const revised = status === 'revised' && revision != null;
  const actionable = !!onRecheck && status === 'doubt';
  const pct = confidence == null ? null : Math.round(Math.min(1, Math.max(0, confidence)) * 100);
  const head = STATUS_TEXT[status] || STATUS_TEXT.doubt;
  const cls = ['q-doubt-marker', 'q-doubt-marker--' + (STATUS_TEXT[status] ? status : 'doubt'), className].filter(Boolean).join(' ');
  const claim = revised ? revision : children;
  const triggerProps = {
    className: 'q-doubt-marker__claim',
    'aria-describedby': id,
    onFocus: show,
    onBlur: hide,
  };
  return (
    <span className={cls} style={style} onMouseEnter={show} onMouseLeave={leave}>
      {actionable
        ? <button type="button" {...triggerProps} onClick={onRecheck}>{claim}<span className="q-sr-only">, {recheckLabel.toLowerCase()}</span></button>
        : <span {...triggerProps} tabIndex={0} aria-busy={status === 'checking' || undefined}>{claim}</span>}
      {status !== 'doubt' && <span aria-hidden="true" className="q-doubt-marker__tag">{head}</span>}
      <span role="tooltip" id={id} className="q-doubt-marker__bubble" data-state={open ? 'open' : 'closed'}>
        <span className="q-doubt-marker__status">
          {head}{pct != null && status === 'doubt' ? ' · ' + pct + '% sure' : ''}
        </span>
        {revised && <span className="q-doubt-marker__was">Was: {children}</span>}
        {reason && <span className="q-doubt-marker__reason">{reason}</span>}
        {actionable && <span className="q-doubt-marker__hint">Press to {recheckLabel.toLowerCase()}</span>}
      </span>
      <span className="q-sr-only" role="status">{status === 'checking' ? 'Re-checking' : status === 'confirmed' ? 'Confirmed' : revised ? 'Revised' : ''}</span>
    </span>
  );
}

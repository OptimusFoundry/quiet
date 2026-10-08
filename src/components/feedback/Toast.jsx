import React from 'react';
import './Toast.scss';

const MARK = {
  default: <span className="q-toast__dot" />,
  neutral: <span className="q-toast__dot" />,
  success: <span className="q-toast__glyph">{'✓'}</span>,
  warning: <span className="q-toast__dot" />,
  error: <span className="q-toast__glyph">!</span>,
};

export function Toast({ title, meta, description, variant, status = 'live', action, onClose, duration, className, style }) {
  // quiet: rise in on mount, fade out before onClose; an auto-dismiss timer pauses while hovered or focused.
  const [closing, setClosing] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const close = () => {
    if (closing) return;
    setClosing(true);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => { setClosing(false); onClose && onClose(); }, reduce ? 0 : 160);
  };
  React.useEffect(() => {
    if (!duration || !onClose || paused || closing) return;
    const t = setTimeout(close, duration);
    return () => clearTimeout(t);
  }, [duration, paused, closing]);
  const kind = variant || (status === 'neutral' ? 'neutral' : 'default');
  const cls = ['q-toast', MARK[kind] && 'q-toast--' + kind, closing ? 'q-anim-fade' : 'q-anim-rise', className].filter(Boolean).join(' ');
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={cls} data-state={closing ? 'closing' : 'open'}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} style={style}>
      <span aria-hidden="true" className="q-toast__mark">{MARK[kind]}</span>
      <div className="q-toast__content">
        {title && <div className="q-toast__title">{title}</div>}
        {description && <div className="q-toast__description">{description}</div>}
        {meta && <div className="q-toast__meta">{meta}</div>}
        {action && <div className="q-toast__action">{action}</div>}
      </div>
      {onClose && <button type="button" onClick={close} aria-label="Dismiss notification" className="q-toast__close">{'×'}</button>}
    </div>
  );
}

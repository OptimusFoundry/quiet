import React from 'react';

export function Toast({ title, meta, description, variant, status = 'live', action, onClose, duration, style }) {
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
  const mark = {
    default: <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--molten)' }} />,
    neutral: <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--ink)' }} />,
    success: <span style={{ fontSize: 13, lineHeight: 1, color: 'var(--ink)' }}>{'\u2713'}</span>,
    warning: <span style={{ width: 8, height: 8, borderRadius: 999, border: '1px solid var(--molten)', boxSizing: 'border-box' }} />,
    error: <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: 'var(--molten)' }}>!</span>,
  }[kind];
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={closing ? 'q-anim-fade' : 'q-anim-rise'} data-state={closing ? 'closing' : 'open'}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 24px', background: 'var(--paper)',
      border: '1px solid ' + (kind === 'error' ? 'var(--molten)' : 'var(--rule-soft)'), borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', minWidth: 280, maxWidth: 420, boxSizing: 'border-box', ...style }}>
      <span aria-hidden="true" style={{ width: 12, height: 20, flex: 'none', display: 'grid', placeItems: 'center' }}>{mark}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.35, color: 'var(--ink)' }}>{title}</div>}
        {description && <div style={{ fontSize: 15, lineHeight: 1.5, color: 'var(--ink-2)' }}>{description}</div>}
        {meta && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{meta}</div>}
        {action && <div style={{ marginTop: 8 }}>{action}</div>}
      </div>
      {onClose && <button type="button" onClick={close} aria-label="Dismiss notification" style={{ background: 'none', border: 0, cursor: 'pointer', color: 'var(--muted)', fontSize: 16, lineHeight: 1, padding: 0 }}>{'\u00d7'}</button>}
    </div>
  );
}

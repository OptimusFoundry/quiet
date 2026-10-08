import React from 'react';

const POS = {
  top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
  left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
  right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
};

export function Tooltip({ content, children, placement = 'top', delay = 0 }) {
  const [open, setOpen] = React.useState(false);
  const t = React.useRef();
  const show = () => { clearTimeout(t.current); t.current = setTimeout(() => setOpen(true), delay); };
  const hide = () => { clearTimeout(t.current); setOpen(false); };
  React.useEffect(() => () => clearTimeout(t.current), []);
  return (
    <span onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      <span role="tooltip" style={{ position: 'absolute', ...POS[placement], background: 'var(--ink)', color: 'var(--paper)',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.5, padding: '6px 10px',
        width: 'max-content', maxWidth: 240, borderRadius: 'var(--radius-sm)', pointerEvents: 'none', opacity: open ? 1 : 0, transition: 'opacity var(--dur-hover) var(--ease-soft)', zIndex: 50 }}>{content}</span>
    </span>
  );
}

import React from 'react';
import { useEscape } from '../../a11y/hooks';

const POS = {
  top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
  bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 8 },
  left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 8 },
  right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 8 },
};
const INTERACTIVE = ['a', 'button', 'input', 'select', 'textarea'];

export function Tooltip({ content, children, placement = 'top', delay = 0 }) {
  const [open, setOpen] = React.useState(false);
  const t = React.useRef();
  const id = React.useId();
  const show = () => { clearTimeout(t.current); t.current = setTimeout(() => setOpen(true), delay); };
  const hide = () => { clearTimeout(t.current); setOpen(false); };
  // quiet: a short grace period lets the pointer cross onto the tooltip without it vanishing (WCAG 1.4.13).
  const leave = () => { clearTimeout(t.current); t.current = setTimeout(() => setOpen(false), 120); };
  React.useEffect(() => () => clearTimeout(t.current), []);
  useEscape(open, hide);
  // quiet: the trigger is described by the tooltip and reachable by keyboard even when it is plain text.
  const el = React.isValidElement(children) ? children : null;
  const plain = el && typeof el.type === 'string' && !INTERACTIVE.includes(el.type) && el.props.tabIndex == null;
  const trigger = el ? React.cloneElement(el, { 'aria-describedby': id, ...(plain ? { tabIndex: 0 } : null) }) : children;
  return (
    <span onMouseEnter={show} onMouseLeave={leave} onFocus={show} onBlur={hide} aria-describedby={el ? undefined : id} tabIndex={el ? undefined : 0} style={{ position: 'relative', display: 'inline-flex' }}>
      {trigger}
      <span role="tooltip" id={id} style={{ position: 'absolute', ...POS[placement], background: 'var(--ink)', color: 'var(--paper)',
        fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.5, padding: '6px 10px',
        width: 'max-content', maxWidth: 240, borderRadius: 'var(--radius-sm)', pointerEvents: open ? 'auto' : 'none', opacity: open ? 1 : 0, visibility: open ? 'visible' : 'hidden', transition: 'opacity var(--dur-hover) var(--ease-soft), visibility var(--dur-hover)', zIndex: 50 }}>{content}</span>
    </span>
  );
}

import React from 'react';
import { useEscape, useFocusTrap, usePresence } from '../../a11y/hooks';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-drawer')) {
  const s = document.createElement('style'); s.id = 'of-kf-drawer';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-drawer-r{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}@keyframes of-drawer-l{from{transform:translateX(-24px);opacity:0}to{transform:none;opacity:1}}@keyframes of-fade{from{opacity:0}to{opacity:1}}}';
  document.head.appendChild(s);
}
const SIZES = { sm: 360, md: 480, lg: 640 };
// quiet: while a modal is open, everything outside it is inert and the page doesn't scroll.
function useModalBackground(ref, active) {
  React.useEffect(() => {
    if (!active || !ref.current) return;
    const done = [];
    for (let n = ref.current; n.parentElement && n !== document.body; n = n.parentElement)
      for (const sib of n.parentElement.children) if (sib !== n && !sib.inert && sib.tagName !== 'SCRIPT') { sib.inert = true; done.push(sib); }
    const overflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { done.forEach(sib => { sib.inert = false; }); document.body.style.overflow = overflow; };
  }, [active, ref]);
}

export function Drawer({ open, onClose, eyebrow, title, accent, description, children, footer, side = 'right', size = 'md', dismissible = true }) {
  const { mounted, state } = usePresence(open, 160);
  const live = open && mounted;
  const scrim = React.useRef(null);
  const box = React.useRef(null);
  const id = React.useId();
  useModalBackground(scrim, live);
  useFocusTrap(box, live);
  useEscape(live && dismissible, onClose);
  if (!mounted) return null;
  const right = side !== 'left';
  return (
    <div ref={scrim} className="q-anim-fade" data-state={state} onClick={dismissible ? onClose : undefined} style={{ position: 'fixed', inset: 0, background: 'var(--overlay-scrim)', zIndex: 100, display: 'flex', justifyContent: right ? 'flex-end' : 'flex-start' }}>
      <aside ref={box} role="dialog" aria-modal="true" aria-labelledby={title ? id + '-t' : undefined} aria-describedby={description ? id + '-d' : undefined} tabIndex={-1} className={right ? 'q-anim-slide-right' : 'q-anim-slide-left'} data-state={state} onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: SIZES[size] || size, height: '100%', background: 'var(--paper)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
          borderRadius: right ? 'var(--radius-xl) 0 0 var(--radius-xl)' : '0 var(--radius-xl) var(--radius-xl) 0', boxShadow: 'var(--shadow-3)', overflow: 'hidden' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, padding: '32px 32px 24px', borderBottom: '1px solid var(--rule-soft)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {eyebrow && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{eyebrow}</div>}
            {title && <div id={id + '-t'} style={{ fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', lineHeight: 1.15, color: 'var(--ink)' }}>{title}{accent && <> <em>{accent}</em></>}<span style={{ color: 'var(--molten)' }}>.</span></div>}
            {description && <div id={id + '-d'} style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--muted)' }}>{description}</div>}
          </div>
          {dismissible && <button type="button" onClick={onClose} aria-label="Close drawer" style={{ background: 'none', border: 0, cursor: 'pointer', fontSize: 20, lineHeight: 1, color: 'var(--ink)', padding: 4 }}>{'\u00d7'}</button>}
        </header>
        <div style={{ flex: 1, overflowY: 'auto', padding: 32, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)' }}>{children}</div>
        {footer && <footer style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', padding: '24px 32px', borderTop: '1px solid var(--rule-soft)' }}>{footer}</footer>}
      </aside>
    </div>
  );
}

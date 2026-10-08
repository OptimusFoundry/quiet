import React from 'react';
import { useEscape, useFocusTrap, usePresence } from '../../a11y/hooks';
import './Drawer.scss';

const SIZES = ['sm', 'md', 'lg'];
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
  const named = SIZES.includes(size);
  return (
    <div ref={scrim} className={'q-drawer q-anim-fade q-drawer--' + (right ? 'right' : 'left')} data-state={state} onClick={dismissible ? onClose : undefined}>
      <aside ref={box} role="dialog" aria-modal="true" aria-labelledby={title ? id + '-t' : undefined} aria-describedby={description ? id + '-d' : undefined} tabIndex={-1}
        className={'q-drawer__panel ' + (right ? 'q-anim-slide-right' : 'q-anim-slide-left') + (named ? ' q-drawer__panel--' + size : '')} data-state={state} onClick={e => e.stopPropagation()}
        style={named ? undefined : { '--_max-width': typeof size === 'number' ? size + 'px' : size }}>
        <header className="q-drawer__header">
          <div className="q-drawer__heading">
            {eyebrow && <div className="q-drawer__eyebrow">{eyebrow}</div>}
            {title && <div id={id + '-t'} className="q-drawer__title">{title}{accent && <> <em>{accent}</em></>}<span className="q-drawer__dot">.</span></div>}
            {description && <div id={id + '-d'} className="q-drawer__description">{description}</div>}
          </div>
          {dismissible && <button type="button" onClick={onClose} aria-label="Close drawer" className="q-drawer__close">{'×'}</button>}
        </header>
        <div className="q-drawer__body">{children}</div>
        {footer && <footer className="q-drawer__footer">{footer}</footer>}
      </aside>
    </div>
  );
}

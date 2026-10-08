import React from 'react';

export function Popover({ trigger, title, children, placement = 'bottom', align = 'center', open, defaultOpen = false, onOpenChange, width = 280, trapFocus = true, style }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const cur = open ?? inner;
  const ref = React.useRef(null);
  const panel = React.useRef(null);
  const set = v => { setInner(v); onOpenChange && onOpenChange(v); };
  React.useEffect(() => {
    if (!cur) return;
    const h = e => ref.current && !ref.current.contains(e.target) && set(false);
    const k = e => e.key === 'Escape' && set(false);
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    if (trapFocus && panel.current) { const f = panel.current.querySelector('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'); f && f.focus(); }
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [cur]);
  const vert = placement === 'top' || placement === 'bottom';
  const pos = { position: 'absolute', zIndex: 60 };
  if (placement === 'bottom') Object.assign(pos, { top: '100%', marginTop: 8 });
  if (placement === 'top') Object.assign(pos, { bottom: '100%', marginBottom: 8 });
  if (placement === 'right') Object.assign(pos, { left: '100%', marginLeft: 8 });
  if (placement === 'left') Object.assign(pos, { right: '100%', marginRight: 8 });
  if (vert) Object.assign(pos, align === 'start' ? { left: 0 } : align === 'end' ? { right: 0 } : { left: '50%', transform: 'translateX(-50%)' });
  else Object.assign(pos, align === 'start' ? { top: 0 } : align === 'end' ? { bottom: 0 } : { top: '50%', transform: 'translateY(-50%)' });
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', ...style }}>
      <span onClick={() => set(!cur)} aria-expanded={cur} aria-haspopup="dialog" style={{ display: 'inline-flex' }}>{trigger}</span>
      {cur && <div ref={panel} role="dialog" style={{ ...pos, width, boxSizing: 'border-box', padding: 20, background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)', textAlign: 'left' }}>
        {title && <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{title}</div>}
        {children}
      </div>}
    </span>
  );
}

import React from 'react';
import { focusables, useEscape, useOutside, usePresence } from '../../a11y/hooks';

export function Popover({ trigger, title, children, placement = 'bottom', align = 'center', open, defaultOpen = false, onOpenChange, width = 280, trapFocus = true, style }) {
  const [inner, setInner] = React.useState(defaultOpen);
  const cur = open ?? inner;
  const ref = React.useRef(null);
  const panel = React.useRef(null);
  const trig = React.useRef(null);
  const refs = React.useMemo(() => [ref], []);
  const id = React.useId();
  const { mounted, state } = usePresence(cur, 160);
  const set = v => { setInner(v); onOpenChange && onOpenChange(v); };
  // quiet: the real trigger (a button) carries the popup state; a non-interactive trigger becomes the button itself.
  const [btn, setBtn] = React.useState(null);
  React.useLayoutEffect(() => {
    const t = trig.current && trig.current.firstElementChild;
    setBtn(t && t.matches('button,a[href],input,[role="button"]') ? t : null);
  });
  React.useLayoutEffect(() => {
    if (!btn) return;
    btn.setAttribute('aria-haspopup', 'dialog'); btn.setAttribute('aria-expanded', String(!!cur));
    if (cur && mounted) btn.setAttribute('aria-controls', id); else btn.removeAttribute('aria-controls');
  });
  const back = () => { const t = btn || trig.current; t && t.focus(); };
  useEscape(cur, () => { set(false); back(); });
  useOutside(refs, cur, () => set(false));
  React.useEffect(() => {
    if (!cur || !mounted || !trapFocus || !panel.current) return;
    const f = focusables(panel.current)[0]; f && f.focus();
  }, [cur, mounted]);
  const vert = placement === 'top' || placement === 'bottom';
  const pos = { position: 'absolute', zIndex: 60 };
  if (placement === 'bottom') Object.assign(pos, { top: '100%', marginTop: 8 });
  if (placement === 'top') Object.assign(pos, { bottom: '100%', marginBottom: 8 });
  if (placement === 'right') Object.assign(pos, { left: '100%', marginLeft: 8 });
  if (placement === 'left') Object.assign(pos, { right: '100%', marginRight: 8 });
  if (vert) Object.assign(pos, align === 'start' ? { left: 0 } : align === 'end' ? { right: 0 } : { left: '50%', transform: 'translateX(-50%)' });
  else Object.assign(pos, align === 'start' ? { top: 0 } : align === 'end' ? { bottom: 0 } : { top: '50%', transform: 'translateY(-50%)' });
  const own = btn ? {} : { role: 'button', tabIndex: 0, 'aria-haspopup': 'dialog', 'aria-expanded': !!cur, 'aria-controls': cur && mounted ? id : undefined,
    onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(!cur); } } };
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', ...style }}>
      <span ref={trig} onClick={() => set(!cur)} {...own} style={{ display: 'inline-flex' }}>{trigger}</span>
      {mounted && <div ref={panel} id={id} role="dialog" aria-labelledby={title ? id + '-t' : undefined} className="q-anim-fade" data-state={state} style={{ ...pos, width, boxSizing: 'border-box', padding: 20, background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', display: 'flex', flexDirection: 'column', gap: 12, fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)', textAlign: 'left' }}>
        {title && <div id={id + '-t'} style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)' }}>{title}</div>}
        {children}
      </div>}
    </span>
  );
}

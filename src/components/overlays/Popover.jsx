import React from 'react';
import { focusables, useEscape, useOutside, usePresence } from '../../a11y/hooks';
import './Popover.scss';

export function Popover({ trigger, title, children, placement = 'bottom', align = 'center', open, defaultOpen = false, onOpenChange, width = 280, trapFocus = true, className, style }) {
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
  const own = btn ? {} : { role: 'button', tabIndex: 0, 'aria-haspopup': 'dialog', 'aria-expanded': !!cur, 'aria-controls': cur && mounted ? id : undefined,
    onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); set(!cur); } } };
  return (
    <span ref={ref} className={className ? 'q-popover ' + className : 'q-popover'} style={style}>
      <span ref={trig} onClick={() => set(!cur)} {...own} className="q-popover__trigger">{trigger}</span>
      {mounted && <div ref={panel} id={id} role="dialog" aria-labelledby={title ? id + '-t' : undefined} className="q-popover__panel q-anim-fade" data-state={state}
        data-placement={placement} data-align={align} style={{ '--_width': typeof width === 'number' ? width + 'px' : width }}>
        {title && <div id={id + '-t'} className="q-popover__title">{title}</div>}
        {children}
      </div>}
    </span>
  );
}

import React from 'react';
import { rovingKeyDown, useEscape, useOutside, usePresence } from '../../a11y/hooks';

const ITEM = '[role^="menuitem"]';
const roving = rovingKeyDown(ITEM, 'vertical');

function MenuItem({ it, size, onPick }) {
  const [h, setH] = React.useState(false);
  const armed = React.useRef(false);
  const off = it.disabled;
  return (
    <div role={it.checked != null ? 'menuitemcheckbox' : 'menuitem'} aria-checked={it.checked} aria-disabled={off || undefined} tabIndex={-1}
      onClick={() => !off && onPick(it)} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), armed.current = e.key === ' ', e.key === 'Enter' && !off && onPick(it))}
      onKeyUp={e => e.key === ' ' && armed.current && (armed.current = false, !off && onPick(it))}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onFocus={() => setH(true)} onBlur={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: size === 'sm' ? '6px 10px' : '10px 12px', borderRadius: 'var(--radius-sm)', cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.4 : 1, outline: 'none',
        background: (h || it.active) && !off ? 'var(--paper-2)' : 'transparent', fontSize: size === 'sm' ? 13 : 15, fontWeight: it.active ? 600 : 400,
        color: it.danger && h ? 'var(--molten)' : 'var(--ink)', transition: 'color var(--dur-hover) var(--ease-soft), background var(--dur-hover) var(--ease-soft)' }}>
      {it.checked != null
        ? <span aria-hidden="true" style={{ width: 14, height: 14, flex: 'none', borderRadius: 4, border: '1px solid var(--ink)', boxSizing: 'border-box', display: 'grid', placeItems: 'center', background: it.checked ? 'var(--ink)' : 'transparent', color: 'var(--paper)', fontSize: 10, lineHeight: 1 }}>{it.checked ? '✓' : ''}</span>
        : it.icon && <span aria-hidden="true" style={{ display: 'inline-flex', width: 16, justifyContent: 'center', color: 'var(--muted)' }}>{it.icon}</span>}
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span>{it.label}</span>
        {it.sublabel && <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)' }}>{it.sublabel}</span>}
      </span>
      {it.shortcut && <span aria-hidden="true" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)' }}>{it.shortcut}</span>}
    </div>
  );
}

export function DropdownMenu({ trigger, items = [], header, caption, size = 'md', align = 'start', width = 240, contextMenu = false, children, onSelect, label, style }) {
  const [open, setOpen] = React.useState(false);
  const [pt, setPt] = React.useState(null);
  const ref = React.useRef(null);
  const trig = React.useRef(null);
  const list = React.useRef(null);
  const from = React.useRef(null);
  const firstFocus = React.useRef('first');
  const refs = React.useMemo(() => [ref], []);
  const id = React.useId();
  const { mounted, state } = usePresence(open, 160);
  // quiet: the real trigger (a button) carries the menu-button state; a non-interactive trigger becomes the button itself.
  const [btn, setBtn] = React.useState(null);
  React.useLayoutEffect(() => {
    const t = !contextMenu && trig.current && trig.current.firstElementChild;
    setBtn(t && t.matches('button,a[href],input,[role="button"]') ? t : null);
  });
  React.useLayoutEffect(() => {
    if (!btn) return;
    if (!btn.id) btn.id = id + '-b';
    btn.setAttribute('aria-haspopup', 'menu'); btn.setAttribute('aria-expanded', String(open));
    if (open && mounted) btn.setAttribute('aria-controls', id); else btn.removeAttribute('aria-controls');
  });
  const close = (refocus = true) => {
    setOpen(false);
    const t = contextMenu ? from.current : btn || trig.current;
    if (refocus && t && t.isConnected) t.focus();
  };
  useEscape(open, () => close());
  useOutside(refs, open, () => setOpen(false));
  React.useEffect(() => {
    if (!open || !mounted || !list.current) return;
    const all = [...list.current.querySelectorAll(ITEM)].filter(el => el.getAttribute('aria-disabled') !== 'true');
    const el = firstFocus.current === 'menu' ? list.current : firstFocus.current === 'last' ? all[all.length - 1] : all[0];
    el && el.focus({ preventScroll: true });
  }, [open, mounted]);
  const show = where => { firstFocus.current = where; from.current = document.activeElement; setOpen(true); };
  const pick = it => { it.onSelect && it.onSelect(it); onSelect && onSelect(it); if (it.checked == null) close(); };
  const onMenuKey = e => {
    if (e.key === 'Tab') { setOpen(false); return; }
    if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const all = [...e.currentTarget.querySelectorAll(ITEM)].filter(el => el.getAttribute('aria-disabled') !== 'true');
      const i = all.indexOf(document.activeElement);
      const hit = [...all.slice(i + 1), ...all.slice(0, i + 1)].find(el => el.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase()));
      hit && hit.focus();
      return;
    }
    if (e.key === 'ArrowUp' && document.activeElement === e.currentTarget) { e.preventDefault(); const all = e.currentTarget.querySelectorAll(ITEM); all.length && all[all.length - 1].focus(); return; }
    roving(e);
  };
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' };
  // Items after a group label (up to the next divider or label) sit in a labelled role="group".
  const body = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.divider) body.push(<div key={i} role="separator" style={{ borderTop: '1px solid var(--rule-soft)', margin: '4px 0' }} />);
    else if (it.group) {
      const kids = [];
      let j = i + 1;
      for (; j < items.length && !items[j].divider && !items[j].group; j++) kids.push(<MenuItem key={j} it={items[j]} size={size} onPick={pick} />);
      body.push(<div key={i} role="group" aria-labelledby={id + '-g' + i}><div id={id + '-g' + i} role="presentation" style={{ ...mono, padding: '10px 16px 4px' }}>{it.group}</div>{kids}</div>);
      i = j - 1;
    } else body.push(<MenuItem key={i} it={it} size={size} onPick={pick} />);
  }
  const menu = mounted && (
    <div ref={list} id={id} role="menu" tabIndex={-1} aria-label={label || (contextMenu ? 'Context menu' : undefined)} aria-labelledby={label || contextMenu ? undefined : btn ? btn.id : id + '-b'} onKeyDown={onMenuKey} className="q-anim-drop" data-state={state} style={{ position: 'absolute', zIndex: 60, width, boxSizing: 'border-box', background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', padding: 6, outline: 'none',
      ...(pt ? { left: pt.x, top: pt.y } : { top: '100%', marginTop: 4, [align === 'end' ? 'right' : 'left']: 0 }) }}>
      {header && <div role="presentation" style={{ padding: '12px 16px', borderBottom: '1px solid var(--rule-soft)', marginBottom: 4 }}>{header}</div>}
      {body}
      {caption && <div role="presentation" style={{ ...mono, padding: '10px 16px 6px', borderTop: '1px solid var(--rule-soft)', marginTop: 4 }}>{caption}</div>}
    </div>
  );
  if (contextMenu) {
    return (
      <div ref={ref} onContextMenu={e => { e.preventDefault(); const r = ref.current.getBoundingClientRect(); setPt({ x: e.clientX - r.left, y: e.clientY - r.top }); show('menu'); }}
        style={{ position: 'relative', ...style }}>{children}{menu}</div>
    );
  }
  const own = btn ? {} : { id: id + '-b', role: 'button', tabIndex: 0, 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': open && mounted ? id : undefined };
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', ...style }}>
      <span ref={trig} onClick={e => { setPt(null); if (open) setOpen(false); else show(e.detail === 0 ? 'first' : 'menu'); }} {...own}
        onKeyDown={e => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setPt(null); show(e.key === 'ArrowUp' ? 'last' : 'first'); }
          else if (!btn && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setPt(null); if (open) setOpen(false); else show('first'); }
        }} style={{ display: 'inline-flex' }}>{trigger}</span>
      {menu}
    </span>
  );
}

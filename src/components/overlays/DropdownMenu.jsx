import React from 'react';

function MenuItem({ it, size, onPick }) {
  const [h, setH] = React.useState(false);
  const off = it.disabled;
  return (
    <div role={it.checked != null ? 'menuitemcheckbox' : 'menuitem'} aria-checked={it.checked} aria-disabled={off || undefined} tabIndex={off ? -1 : 0}
      onClick={() => !off && onPick(it)} onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), !off && onPick(it))}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: size === 'sm' ? '6px 10px' : '10px 12px', borderRadius: 'var(--radius-sm)', cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.4 : 1, outline: 'none',
        background: (h || it.active) && !off ? 'var(--paper-2)' : 'transparent', fontSize: size === 'sm' ? 13 : 15, fontWeight: it.active ? 600 : 400,
        color: it.danger && h ? 'var(--molten)' : 'var(--ink)', transition: 'color var(--dur-hover) var(--ease-soft)' }}>
      {it.checked != null
        ? <span aria-hidden="true" style={{ width: 14, height: 14, flex: 'none', borderRadius: 4, border: '1px solid var(--ink)', boxSizing: 'border-box', display: 'grid', placeItems: 'center', background: it.checked ? 'var(--ink)' : 'transparent', color: 'var(--paper)', fontSize: 10, lineHeight: 1 }}>{it.checked ? '\u2713' : ''}</span>
        : it.icon && <span aria-hidden="true" style={{ display: 'inline-flex', width: 16, justifyContent: 'center', color: 'var(--muted)' }}>{it.icon}</span>}
      <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span>{it.label}</span>
        {it.sublabel && <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)' }}>{it.sublabel}</span>}
      </span>
      {it.shortcut && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', color: 'var(--muted)' }}>{it.shortcut}</span>}
    </div>
  );
}

export function DropdownMenu({ trigger, items = [], header, caption, size = 'md', align = 'start', width = 240, contextMenu = false, children, onSelect, style }) {
  const [open, setOpen] = React.useState(false);
  const [pt, setPt] = React.useState(null);
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const k = e => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [open]);
  const pick = it => { it.onSelect && it.onSelect(it); onSelect && onSelect(it); if (it.checked == null) setOpen(false); };
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' };
  const menu = open && (
    <div role="menu" style={{ position: 'absolute', zIndex: 60, width, boxSizing: 'border-box', background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', padding: 6,
      ...(pt ? { left: pt.x, top: pt.y } : { top: '100%', marginTop: 4, [align === 'end' ? 'right' : 'left']: 0 }) }}>
      {header && <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--rule-soft)', marginBottom: 4 }}>{header}</div>}
      {items.map((it, i) => it.divider ? <div key={i} role="separator" style={{ borderTop: '1px solid var(--rule-soft)', margin: '4px 0' }} />
        : it.group ? <div key={i} style={{ ...mono, padding: '10px 16px 4px' }}>{it.group}</div>
        : <MenuItem key={i} it={it} size={size} onPick={pick} />)}
      {caption && <div style={{ ...mono, padding: '10px 16px 6px', borderTop: '1px solid var(--rule-soft)', marginTop: 4 }}>{caption}</div>}
    </div>
  );
  if (contextMenu) {
    return (
      <div ref={ref} onContextMenu={e => { e.preventDefault(); const r = ref.current.getBoundingClientRect(); setPt({ x: e.clientX - r.left, y: e.clientY - r.top }); setOpen(true); }}
        style={{ position: 'relative', ...style }}>{children}{menu}</div>
    );
  }
  return (
    <span ref={ref} style={{ position: 'relative', display: 'inline-flex', ...style }}>
      <span onClick={() => { setPt(null); setOpen(!open); }} aria-haspopup="menu" aria-expanded={open} style={{ display: 'inline-flex' }}>{trigger}</span>
      {menu}
    </span>
  );
}

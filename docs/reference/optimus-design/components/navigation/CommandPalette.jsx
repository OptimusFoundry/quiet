import React from 'react';

if (typeof document !== 'undefined' && !document.getElementById('of-kf-fade')) {
  const s = document.createElement('style'); s.id = 'of-kf-fade';
  s.textContent = '@media (prefers-reduced-motion: no-preference){@keyframes of-fade{from{opacity:0}to{opacity:1}}}';
  document.head.appendChild(s);
}

export function CommandPalette({ open, onClose, onOpen, items = [], placeholder = 'Type a command or search', emptyText = 'Nothing matches.', hotkey = true }) {
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(0);
  const listRef = React.useRef(null);
  React.useEffect(() => {
    if (!hotkey || !onOpen) return;
    const k = e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); onOpen(); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [hotkey, onOpen]);
  React.useEffect(() => { if (open) { setQ(''); setActive(0); } }, [open]);
  const ql = q.toLowerCase();
  const flat = items.filter(it => !ql || String(it.label).toLowerCase().includes(ql) || String(it.description || '').toLowerCase().includes(ql) || String(it.group || '').toLowerCase().includes(ql));
  const order = []; const byGroup = {};
  flat.forEach(it => { const g = it.group || ''; if (!byGroup[g]) { byGroup[g] = []; order.push(g); } byGroup[g].push(it); });
  const sorted = order.flatMap(g => byGroup[g]);
  React.useEffect(() => { const el = listRef.current && listRef.current.querySelector('[data-active="true"]'); if (el) { const p = listRef.current; if (el.offsetTop < p.scrollTop) p.scrollTop = el.offsetTop; else if (el.offsetTop + el.offsetHeight > p.scrollTop + p.clientHeight) p.scrollTop = el.offsetTop + el.offsetHeight - p.clientHeight; } }, [active]);
  if (!open) return null;
  const run = it => { it && it.onSelect && it.onSelect(it); onClose && onClose(); };
  const key = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(sorted.length - 1, a + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); run(sorted[active]); }
    else if (e.key === 'Escape') onClose && onClose();
  };
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' };
  let idx = -1;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'var(--overlay-scrim)', zIndex: 110, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '15vh 24px 24px', animation: 'of-fade 0.2s linear' }}>
      <div role="dialog" aria-modal="true" aria-label="Command palette" onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 640, background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-3)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '70vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 20px', borderBottom: '1px solid var(--rule-soft)' }}>
          <span aria-hidden="true" style={{ ...mono, fontSize: 11, color: 'var(--ink)' }}>/</span>
          <input autoFocus value={q} onChange={e => { setQ(e.target.value); setActive(0); }} onKeyDown={key} placeholder={placeholder} aria-label="Search commands"
            style={{ flex: 1, height: 56, border: 0, outline: 'none', background: 'transparent', fontFamily: 'var(--font-sans)', fontSize: 19, color: 'var(--ink)' }} />
          <span style={mono}>Esc</span>
        </div>
        <div ref={listRef} role="listbox" style={{ overflowY: 'auto', padding: '8px 0', position: 'relative' }}>
          {sorted.length === 0 && <div style={{ padding: '32px 20px', textAlign: 'center', fontSize: 15, color: 'var(--muted)' }}>{emptyText}</div>}
          {order.map(g => (
            <div key={g || '_'}>
              {g && <div style={{ ...mono, padding: '12px 20px 6px' }}>{g}</div>}
              {byGroup[g].map(it => { idx++; const i = idx; const on = i === active; return (
                <div key={it.id ?? it.label} role="option" aria-selected={on} data-active={on} onMouseMove={() => setActive(i)} onClick={() => run(it)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', margin: '0 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', background: on ? 'var(--paper-2)' : 'transparent' }}>
                  {it.icon && <span aria-hidden="true" style={{ width: 20, display: 'inline-flex', justifyContent: 'center', color: 'var(--muted)' }}>{it.icon}</span>}
                  <span style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 15, color: 'var(--ink)' }}>{it.label}</span>
                    {it.description && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{it.description}</span>}
                  </span>
                  {it.shortcut && <span style={mono}>{it.shortcut}</span>}
                  {on && <span aria-hidden="true" style={{ color: 'var(--ink)', fontSize: 13 }}>{'\u21b5'}</span>}
                </div>
              ); })}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 24, padding: '10px 20px', borderTop: '1px solid var(--rule-soft)', ...mono }}>
          <span>{'\u2191\u2193'} Navigate</span><span>{'\u21b5'} Select</span><span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}

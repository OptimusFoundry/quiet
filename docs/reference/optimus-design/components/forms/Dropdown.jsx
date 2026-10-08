import React from 'react';

const SIZES = { sm: { h: 36, fs: 15, px: 12 }, md: { h: 48, fs: 17, px: 16 }, lg: { h: 56, fs: 19, px: 20 } };
const norm = o => typeof o === 'string' ? { value: o, label: o } : o;

export function Dropdown({ label, options = [], value, defaultValue, onChange, placeholder = 'Select', size = 'md', variant = 'default', fullWidth = false, align = 'start', disabled = false, helperText, error, style }) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const [active, setActive] = React.useState(-1);
  const ref = React.useRef(null);
  const cur = value ?? inner;
  const opts = options.map(norm);
  const sel = opts.find(o => !o.divider && o.value === cur);
  const sz = SIZES[size] || SIZES.md;
  React.useEffect(() => {
    if (!open) return;
    const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const pick = o => { if (o.disabled) return; setInner(o.value); onChange && onChange(o.value); setOpen(false); };
  const key = e => {
    const sel = opts.map((o, i) => (!o.divider && !o.disabled ? i : -1)).filter(i => i >= 0);
    if (e.key === 'Escape') setOpen(false);
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!open) { setOpen(true); return; }
      const p = sel.indexOf(active); const n = e.key === 'ArrowDown' ? sel[Math.min(sel.length - 1, p + 1)] : sel[Math.max(0, p - 1)];
      setActive(n ?? sel[0]);
    } else if ((e.key === 'Enter' || e.key === ' ') ) { e.preventDefault(); if (open && active >= 0) pick(opts[active]); else setOpen(true); }
  };
  const filled = variant === 'filled';
  return (
    <div ref={ref} style={{ position: 'relative', display: fullWidth ? 'flex' : 'inline-flex', flexDirection: 'column', gap: 8, minWidth: 220, opacity: disabled ? 0.4 : 1, ...style }}>
      {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>}
      <button type="button" disabled={disabled} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)} onKeyDown={key}
        style={{ display: 'flex', alignItems: 'center', gap: 12, height: sz.h, padding: '0 ' + sz.px + 'px', boxSizing: 'border-box', width: '100%', textAlign: 'left',
          background: filled && !open ? 'var(--paper-2)' : 'var(--paper)', border: '1px solid ' + (error ? 'var(--molten)' : open ? 'var(--ink)' : filled ? 'var(--paper-2)' : 'var(--rule-soft)'),
          borderRadius: 'var(--radius-md)', boxShadow: open ? 'var(--ring-focus)' : 'none', fontFamily: 'var(--font-sans)', fontSize: sz.fs, color: sel ? 'var(--ink)' : 'var(--muted-2)', cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none',
          transition: 'border-color var(--dur-hover) var(--ease-soft)' }}>
        {sel && sel.icon && <span style={{ display: 'inline-flex', color: 'var(--muted)' }}>{sel.icon}</span>}
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sel ? sel.label : placeholder}</span>
        <span aria-hidden="true" style={{ color: 'var(--muted)', transition: 'transform var(--dur-hover) var(--ease-soft)', transform: open ? 'rotate(180deg)' : 'none' }}>{'\u2193'}</span>
      </button>
      {open && <div role="listbox" style={{ position: 'absolute', top: '100%', [align === 'end' ? 'right' : 'left']: 0, marginTop: 4, minWidth: '100%', maxHeight: 300, overflowY: 'auto',
        background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', zIndex: 40, padding: 6, boxSizing: 'border-box' }}>
        {opts.map((o, i) => o.divider
          ? <div key={'d' + i} style={{ borderTop: '1px solid var(--rule-soft)', margin: '4px 0' }} />
          : <div key={o.value} role="option" aria-selected={o.value === cur} aria-disabled={o.disabled || undefined} onMouseEnter={() => setActive(i)} onClick={() => pick(o)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: o.disabled ? 'not-allowed' : 'pointer', opacity: o.disabled ? 0.4 : 1,
                background: active === i && !o.disabled ? 'var(--paper-2)' : 'transparent', fontSize: 15, color: 'var(--ink)' }}>
              {o.icon && <span style={{ display: 'inline-flex', color: 'var(--muted)', paddingTop: 2 }}>{o.icon}</span>}
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span>{o.label}</span>
                {o.description && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{o.description}</span>}
              </span>
              <span aria-hidden="true" style={{ width: 12, color: 'var(--ink)' }}>{o.value === cur ? '\u2713' : ''}</span>
            </div>)}
      </div>}
      {(error || helperText) && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: error ? 'var(--molten)' : 'var(--muted)' }}>{error || helperText}</span>}
    </div>
  );
}

import React from 'react';

const SIZES = { sm: { h: 36, fs: 15, px: 12 }, md: { h: 48, fs: 17, px: 16 }, lg: { h: 56, fs: 19, px: 20 } };
const norm = o => typeof o === 'string' ? { value: o, label: o } : o;

export function MultiSelect({ label, options = [], value, defaultValue = [], onChange, placeholder = 'Select', size = 'md', variant = 'default', fullWidth = false, maxDisplay = 3, searchable, disabled = false, helperText, error, style }) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const [q, setQ] = React.useState('');
  const ref = React.useRef(null);
  const cur = value ?? inner;
  const opts = options.map(norm);
  const sz = SIZES[size] || SIZES.md;
  const canSearch = searchable ?? opts.length > 8;
  React.useEffect(() => {
    if (!open) return;
    const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const k = e => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [open]);
  const set = next => { setInner(next); onChange && onChange(next); };
  const toggle = o => { if (o.disabled) return; set(cur.includes(o.value) ? cur.filter(v => v !== o.value) : [...cur, o.value]); };
  const chosen = opts.filter(o => !o.divider && cur.includes(o.value));
  const shown = opts.filter(o => o.divider ? !q : String(o.label).toLowerCase().includes(q.toLowerCase()));
  const filled = variant === 'filled';
  const chip = o => (
    <span key={o.value} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
      lineHeight: 1, padding: '4px 8px', borderRadius: 999, border: '1px solid var(--ink)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
      {o.label}<span role="button" aria-label={'Remove ' + o.label} onClick={e => { e.stopPropagation(); if (!disabled) toggle(o); }} style={{ cursor: 'pointer', fontSize: 12 }}>{'\u00d7'}</span>
    </span>
  );
  return (
    <div ref={ref} style={{ position: 'relative', display: fullWidth ? 'flex' : 'inline-flex', flexDirection: 'column', gap: 8, minWidth: 260, opacity: disabled ? 0.4 : 1, ...style }}>
      {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>}
      <div role="button" tabIndex={disabled ? -1 : 0} aria-haspopup="listbox" aria-expanded={open} onClick={() => !disabled && setOpen(!open)}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') && (e.preventDefault(), setOpen(true))}
        style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: sz.h, padding: '6px ' + sz.px + 'px', boxSizing: 'border-box', width: '100%',
          background: filled && !open ? 'var(--paper-2)' : 'var(--paper)', border: '1px solid ' + (error ? 'var(--molten)' : open ? 'var(--ink)' : filled ? 'var(--paper-2)' : 'var(--rule-soft)'),
          borderRadius: 'var(--radius-md)', boxShadow: open ? 'var(--ring-focus)' : 'none', fontSize: sz.fs, color: 'var(--muted-2)', cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none', transition: 'border-color var(--dur-hover) var(--ease-soft)' }}>
        <span style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6, minWidth: 0 }}>
          {chosen.length === 0 ? placeholder : chosen.slice(0, maxDisplay).map(chip)}
          {chosen.length > maxDisplay && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', alignSelf: 'center' }}>+{chosen.length - maxDisplay}</span>}
        </span>
        <span aria-hidden="true" style={{ color: 'var(--muted)', transition: 'transform var(--dur-hover) var(--ease-soft)', transform: open ? 'rotate(180deg)' : 'none' }}>{'\u2193'}</span>
      </div>
      {open && <div role="listbox" aria-multiselectable="true" style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, minWidth: '100%', background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', overflow: 'hidden', zIndex: 40, boxSizing: 'border-box' }}>
        {canSearch && <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Filter"
          style={{ width: '100%', boxSizing: 'border-box', border: 0, borderBottom: '1px solid var(--rule-soft)', outline: 'none', padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--ink)' }} />}
        <div style={{ maxHeight: 280, overflowY: 'auto', padding: 6 }}>
          {shown.map((o, i) => o.divider
            ? <div key={'d' + i} style={{ borderTop: '1px solid var(--rule-soft)', margin: '4px 0' }} />
            : <MSOption key={o.value} o={o} on={cur.includes(o.value)} onPick={() => toggle(o)} />)}
          {shown.length === 0 && <div style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>No matches</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderTop: '1px solid var(--rule-soft)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          <span>{cur.length} selected</span>
          <button type="button" onClick={() => set([])} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: 'var(--ink)' }}>Clear</button>
        </div>
      </div>}
      {(error || helperText) && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: error ? 'var(--molten)' : 'var(--muted)' }}>{error || helperText}</span>}
    </div>
  );
}

function MSOption({ o, on, onPick }) {
  const [h, setH] = React.useState(false);
  return (
    <div role="option" aria-selected={on} aria-disabled={o.disabled || undefined} onClick={onPick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: o.disabled ? 'not-allowed' : 'pointer', opacity: o.disabled ? 0.4 : 1,
        background: h && !o.disabled ? 'var(--paper-2)' : 'transparent', fontSize: 15, color: 'var(--ink)' }}>
      <span aria-hidden="true" style={{ width: 16, height: 16, flex: 'none', marginTop: 2, borderRadius: 'var(--radius-xs)', border: '1px solid var(--ink)', boxSizing: 'border-box', display: 'grid', placeItems: 'center',
        background: on ? 'var(--ink)' : 'var(--paper)', color: 'var(--paper)', fontSize: 11, lineHeight: 1 }}>{on ? '\u2713' : ''}</span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span>{o.label}</span>{o.description && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{o.description}</span>}
      </span>
    </div>
  );
}

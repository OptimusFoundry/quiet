import React from 'react';
import { usePresence } from '../../a11y/hooks';

const SIZES = { sm: { h: 36, fs: 15, px: 12 }, md: { h: 48, fs: 17, px: 16 }, lg: { h: 56, fs: 19, px: 20 } };
const norm = o => typeof o === 'string' ? { value: o, label: o } : o;
const text = o => typeof o.label === 'string' || typeof o.label === 'number' ? String(o.label) : String(o.value ?? '');
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function MultiSelect({ label, options = [], value, defaultValue = [], onChange, placeholder = 'Select', size = 'md', variant = 'default', fullWidth = false, maxDisplay = 3, searchable, disabled = false, helperText, error, style }) {
  const [open, setOpen] = React.useState(false);
  const [inner, setInner] = React.useState(defaultValue);
  const [q, setQ] = React.useState('');
  const [active, setActive] = React.useState(-1);
  const [fresh, setFresh] = React.useState([]); // values added since mount: their pills fade in
  const [gone, setGone] = React.useState([]); // removed pills fading out: { o, at }
  const ref = React.useRef(null);
  const combo = React.useRef(null);
  const uid = React.useId();
  const listId = uid + 'list', labelId = uid + 'label', hintId = uid + 'hint', sumId = uid + 'sum', optId = i => uid + 'opt' + i;
  const presence = usePresence(open);
  const cur = value ?? inner;
  const opts = options.map(norm);
  const sz = SIZES[size] || SIZES.md;
  const canSearch = searchable ?? opts.length > 8;
  React.useEffect(() => {
    if (!open) return;
    const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);
  React.useEffect(() => {
    if (!open || active < 0) return;
    const el = document.getElementById(optId(active)); el && el.scrollIntoView && el.scrollIntoView({ block: 'nearest' });
  }, [open, active]);
  const set = next => { setInner(next); onChange && onChange(next); };
  const leave = (o, at) => { if (at < 0 || at >= maxDisplay) return; setGone(g => [...g, { o, at }]); setTimeout(() => setGone(g => g.filter(x => x.o !== o)), reduced() ? 0 : 160); };
  const toggle = o => {
    if (o.disabled) return;
    const on = cur.includes(o.value);
    if (on) leave(o, chosen.findIndex(c => c.value === o.value));
    else { setFresh(f => [...f, o.value]); setGone(g => g.filter(x => x.o.value !== o.value)); }
    set(on ? cur.filter(v => v !== o.value) : [...cur, o.value]);
  };
  const clear = () => { chosen.forEach((o, i) => leave(o, i)); set([]); };
  const chosen = opts.filter(o => !o.divider && cur.includes(o.value));
  const shown = opts.filter(o => o.divider ? !q : String(o.label).toLowerCase().includes(q.toLowerCase()));
  const filled = variant === 'filled';
  const show = () => { const i = opts.findIndex(o => !o.divider && !o.disabled && cur.includes(o.value)); setQ(''); setActive(i >= 0 ? i : opts.findIndex(o => !o.divider && !o.disabled)); setOpen(true); };
  // Keyboard removal moves focus to the next pill's remove button, or back to the field.
  const removeByKey = (o, i) => {
    toggle(o);
    requestAnimationFrame(() => { const b = ref.current && ref.current.querySelectorAll('[data-pill-remove][tabindex="0"]'); ((b && (b[i] || b[i - 1])) || combo.current).focus(); });
  };
  const key = e => {
    const sel = shown.map((o, i) => (!o.divider && !o.disabled ? i : -1)).filter(i => i >= 0), k = e.key, inInput = e.target.tagName === 'INPUT';
    if (!open) { if (k === 'Enter' || k === ' ' || k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); show(); } return; }
    if (k === 'ArrowDown' || k === 'ArrowUp') {
      e.preventDefault();
      const p = sel.indexOf(active); const n = k === 'ArrowDown' ? sel[Math.min(sel.length - 1, p + 1)] : sel[Math.max(0, p - 1)];
      setActive(n ?? sel[0] ?? -1);
    } else if ((k === 'Home' || k === 'End') && !inInput) { e.preventDefault(); setActive(k === 'Home' ? sel[0] : sel[sel.length - 1]); }
    else if (k === 'Enter' || (k === ' ' && !inInput)) { e.preventDefault(); if (active >= 0 && shown[active]) toggle(shown[active]); }
    else if (k === 'Backspace' && inInput && !q && chosen.length) { e.preventDefault(); toggle(chosen[chosen.length - 1]); }
    else if (k === 'Tab' && !inInput) setOpen(false);
  };
  const pills = chosen.slice(0, maxDisplay).map(o => ({ o, ghost: false }));
  gone.forEach(g => pills.splice(Math.min(g.at, pills.length), 0, { o: g.o, ghost: true }));
  const chip = ({ o, ghost }, i) => (
    <span key={(ghost ? 'g:' : '') + o.value} className={ghost || fresh.includes(o.value) ? 'q-anim-fade' : undefined} data-state={ghost ? 'closing' : fresh.includes(o.value) ? 'open' : undefined} aria-hidden={ghost || undefined} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
      lineHeight: 1, padding: '4px 8px', borderRadius: 999, border: '1px solid var(--ink)', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
      {o.label}<span role="button" data-pill-remove tabIndex={ghost || disabled ? -1 : 0} aria-label={'Remove ' + text(o)} aria-disabled={disabled || undefined} onClick={e => { e.stopPropagation(); if (!disabled && !ghost) toggle(o); }}
        onKeyDown={e => { if (['Enter', ' ', 'Delete', 'Backspace'].includes(e.key)) { e.preventDefault(); e.stopPropagation(); if (!disabled && !ghost) removeByKey(o, i - gone.filter(g => g.at <= i).length); } }}
        style={{ cursor: 'pointer', fontSize: 12, position: 'relative' }}>{'\u00d7'}</span>
    </span>
  );
  return (
    <div ref={ref} onKeyDown={e => { if (open && e.key === 'Escape') { e.stopPropagation(); setOpen(false); combo.current && combo.current.focus(); } }}
      onBlur={e => open && ref.current && !ref.current.contains(e.relatedTarget) && setOpen(false)} style={{ position: 'relative', display: fullWidth ? 'flex' : 'inline-flex', flexDirection: 'column', gap: 8, minWidth: 260, opacity: disabled ? 0.4 : 1, ...style }}>
      {label && <span id={labelId} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>}
      <div onClick={() => !disabled && (open ? setOpen(false) : show())}
        style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, minHeight: sz.h, padding: '6px ' + sz.px + 'px', boxSizing: 'border-box', width: '100%',
          background: filled && !open ? 'var(--paper-2)' : 'var(--paper)', border: '1px solid ' + (error ? 'var(--molten)' : open ? 'var(--ink)' : filled ? 'var(--paper-2)' : 'var(--rule-soft)'),
          borderRadius: 'var(--radius-md)', boxShadow: open ? 'var(--ring-focus)' : 'none', fontSize: sz.fs, color: 'var(--muted-2)', cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none', transition: 'border-color var(--dur-hover) var(--ease-soft)' }}>
        {/* quiet: the focusable combobox is a transparent layer over the field, so the pills' remove buttons are not nested inside it */}
        <span ref={combo} role="combobox" tabIndex={disabled ? -1 : 0} aria-haspopup="listbox" aria-expanded={open} aria-controls={open || presence.mounted ? listId : undefined}
          aria-activedescendant={open && !canSearch && active >= 0 ? optId(active) : undefined} aria-labelledby={label ? labelId : undefined} aria-label={label ? undefined : placeholder}
          aria-describedby={sumId + (error || helperText ? ' ' + hintId : '')} aria-invalid={error ? true : undefined} aria-disabled={disabled || undefined} onKeyDown={key}
          style={{ position: 'absolute', inset: 0, borderRadius: 'inherit' }} />
        <span id={sumId} className="q-sr-only">{chosen.length ? chosen.map(text).join(', ') : 'None selected'}</span>
        <span style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6, minWidth: 0 }}>
          {chosen.length === 0 && gone.length === 0 ? placeholder : pills.map(chip)}
          {chosen.length > maxDisplay && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', alignSelf: 'center' }}>+{chosen.length - maxDisplay}</span>}
        </span>
        <span aria-hidden="true" style={{ color: 'var(--muted)', transition: 'transform var(--dur-hover) var(--ease-soft)', transform: open ? 'rotate(180deg)' : 'none' }}>{'\u2193'}</span>
      </div>
      {(open || presence.mounted) && <div className="q-anim-drop" data-state={open ? 'open' : presence.state} onMouseDown={e => e.target.tagName !== 'INPUT' && e.preventDefault()}
        style={{ pointerEvents: open ? undefined : 'none', position: 'absolute', top: '100%', left: 0, marginTop: 4, minWidth: '100%', background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', overflow: 'hidden', zIndex: 40, boxSizing: 'border-box' }}>
        {canSearch && <input autoFocus value={q} onChange={e => { setQ(e.target.value); setActive(-1); }} placeholder="Filter" aria-label="Filter options" role="combobox" aria-expanded={open} aria-controls={listId}
          aria-autocomplete="list" aria-activedescendant={open && active >= 0 && shown[active] ? optId(active) : undefined} onKeyDown={key}
          style={{ width: '100%', boxSizing: 'border-box', border: 0, borderBottom: '1px solid var(--rule-soft)', outline: 'none', padding: '12px 16px', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--ink)' }} />}
        <div id={listId} role="listbox" aria-multiselectable="true" aria-labelledby={label ? labelId : undefined} style={{ maxHeight: 280, overflowY: 'auto', padding: 6 }}>
          {shown.map((o, i) => o.divider
            ? <div key={'d' + i} style={{ borderTop: '1px solid var(--rule-soft)', margin: '4px 0' }} />
            : <MSOption key={o.value} id={optId(i)} o={o} on={cur.includes(o.value)} act={active === i} onHover={() => setActive(i)} onPick={() => toggle(o)} />)}
          {shown.length === 0 && <div style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>No matches</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px', borderTop: '1px solid var(--rule-soft)', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          <span aria-live="polite">{cur.length} selected</span>
          <button type="button" onClick={clear} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: 'var(--ink)' }}>Clear</button>
        </div>
      </div>}
      {(error || helperText) && <span id={hintId} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: error ? 'var(--molten)' : 'var(--muted)' }}>{error || helperText}</span>}
    </div>
  );
}

function MSOption({ id, o, on, act, onHover, onPick }) {
  const [h, setH] = React.useState(false);
  return (
    <div id={id} role="option" aria-selected={on} aria-disabled={o.disabled || undefined} onClick={onPick} onMouseEnter={() => { setH(true); onHover && onHover(); }} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: o.disabled ? 'not-allowed' : 'pointer', opacity: o.disabled ? 0.4 : 1,
        background: (h || act) && !o.disabled ? 'var(--paper-2)' : 'transparent', fontSize: 15, color: 'var(--ink)', transition: 'background var(--dur-hover) var(--ease-soft)' }}>
      <span aria-hidden="true" style={{ width: 16, height: 16, flex: 'none', marginTop: 2, borderRadius: 'var(--radius-xs)', border: '1px solid var(--ink)', boxSizing: 'border-box', display: 'grid', placeItems: 'center',
        background: on ? 'var(--ink)' : 'var(--paper)', color: 'var(--paper)', fontSize: 11, lineHeight: 1 }}>{on ? '\u2713' : ''}</span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span>{o.label}</span>{o.description && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{o.description}</span>}
      </span>
    </div>
  );
}

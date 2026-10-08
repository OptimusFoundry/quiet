import React from 'react';
import { useFocusTrap, usePresence } from '../../a11y/hooks';

const SIZES = { sm: { h: 36, fs: 15, px: 12 }, md: { h: 48, fs: 17, px: 16 }, lg: { h: 56, fs: 19, px: 20 } };
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const strip = d => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
const same = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const defFmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d, n) => { const t = new Date(d.getFullYear(), d.getMonth() + n, 1); return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate())); };
const longFmt = d => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

function NavBtn({ children, onClick, label }) {
  const [h, setH] = React.useState(false);
  return <button type="button" aria-label={label} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onFocus={() => setH(true)} onBlur={() => setH(false)}
    style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid ' + (h ? 'var(--ink)' : 'var(--rule-soft)'), background: 'var(--paper)', cursor: 'pointer', color: 'var(--ink)', fontSize: 15, lineHeight: 1, transition: 'border-color var(--dur-hover) var(--ease-soft)' }}>{children}</button>;
}

export function DatePicker({ label, value, defaultValue, onChange, min, max, weekStartsOn = 0, format = defFmt, placeholder = 'Pick a date', size = 'md', disabled = false, helperText, error, style }) {
  const [inner, setInner] = React.useState(defaultValue || null);
  const cur = value !== undefined ? value : inner;
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(() => { const b = cur || new Date(); return new Date(b.getFullYear(), b.getMonth(), 1); });
  const [hov, setHov] = React.useState(null);
  const [focus, setFocus] = React.useState(null); // roving day in the grid
  const [paged, setPaged] = React.useState(false); // month changed since opening: crossfade the days
  const ref = React.useRef(null);
  const dialog = React.useRef(null);
  const moveFocus = React.useRef(false);
  const uid = React.useId();
  const dialogId = uid + 'dialog', labelId = uid + 'label', valueId = uid + 'value', hintId = uid + 'hint', headId = uid + 'head';
  const presence = usePresence(open);
  const sz = SIZES[size] || SIZES.md;
  const today = strip(new Date());
  const lo = strip(min), hi = strip(max);
  React.useEffect(() => {
    if (!open) return;
    const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h);
  }, [open]);
  useFocusTrap(dialog, open);
  React.useEffect(() => {
    if (!open || !moveFocus.current || !focus) return;
    moveFocus.current = false;
    const b = dialog.current && dialog.current.querySelector('[data-day="' + focus.getTime() + '"]'); b && b.focus();
  }, [open, focus, view]);
  const pick = d => { setInner(d); onChange && onChange(d); setOpen(false); };
  const toggleOpen = () => {
    if (open) { setOpen(false); return; }
    const f = strip(cur) || today;
    setView(new Date(f.getFullYear(), f.getMonth(), 1)); setFocus(f); setPaged(false); moveFocus.current = true; setOpen(true);
  };
  const page = n => { const f = addMonths(focus || view, n); setView(new Date(f.getFullYear(), f.getMonth(), 1)); setFocus(f); setPaged(true); };
  const gridKey = e => {
    if (!focus) return;
    const k = e.key, wd = (focus.getDay() - weekStartsOn + 7) % 7;
    const to = k === 'ArrowLeft' ? addDays(focus, -1) : k === 'ArrowRight' ? addDays(focus, 1) : k === 'ArrowUp' ? addDays(focus, -7) : k === 'ArrowDown' ? addDays(focus, 7)
      : k === 'Home' ? addDays(focus, -wd) : k === 'End' ? addDays(focus, 6 - wd) : k === 'PageUp' ? addMonths(focus, e.shiftKey ? -12 : -1) : k === 'PageDown' ? addMonths(focus, e.shiftKey ? 12 : 1) : null;
    if (!to) return;
    e.preventDefault();
    if (to.getMonth() !== m || to.getFullYear() !== y) { setView(new Date(to.getFullYear(), to.getMonth(), 1)); setPaged(true); }
    moveFocus.current = true; setFocus(to);
  };
  const y = view.getFullYear(), m = view.getMonth();
  const lead = (new Date(y, m, 1).getDay() - weekStartsOn + 7) % 7;
  const count = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => new Date(y, m, i + 1))];
  const heads = DAYS.slice(weekStartsOn).concat(DAYS.slice(0, weekStartsOn));
  const off = d => (lo && d < lo) || (hi && d > hi);
  const tabDay = focus && focus.getMonth() === m && focus.getFullYear() === y ? focus.getTime() : (cur && cur.getMonth() === m && cur.getFullYear() === y ? strip(cur) : new Date(y, m, 1)).getTime();
  const weeks = []; for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' };
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', gap: 8, minWidth: 240, opacity: disabled ? 0.4 : 1, ...style }}>
      {label && <span id={labelId} style={{ ...mono, color: 'var(--muted)' }}>{label}</span>}
      <button type="button" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} aria-controls={open || presence.mounted ? dialogId : undefined}
        aria-labelledby={(label ? labelId + ' ' : '') + valueId} aria-describedby={error || helperText ? hintId : undefined} aria-invalid={error ? true : undefined} onClick={toggleOpen}
        style={{ display: 'flex', alignItems: 'center', gap: 12, height: sz.h, padding: '0 ' + sz.px + 'px', boxSizing: 'border-box', width: '100%', textAlign: 'left', background: 'var(--paper)',
          border: '1px solid ' + (error ? 'var(--molten)' : open ? 'var(--ink)' : 'var(--rule-soft)'), borderRadius: 'var(--radius-md)', boxShadow: open ? 'var(--ring-focus)' : 'none', fontFamily: 'var(--font-sans)', fontSize: sz.fs,
          color: cur ? 'var(--ink)' : 'var(--muted-2)', cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none', transition: 'border-color var(--dur-hover) var(--ease-soft)' }}>
        <span id={valueId} style={{ flex: 1 }}>{cur ? format(cur) : placeholder}</span>
        <span aria-hidden="true" style={{ ...mono, color: 'var(--muted)' }}>{cur ? String(cur.getDate()).padStart(2, '0') : '--'}</span>
      </button>
      {(open || presence.mounted) && <div ref={dialog} id={dialogId} role="dialog" aria-modal="true" aria-label="Choose date" className="q-anim-drop" data-state={open ? 'open' : presence.state}
        onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); } }} style={{ pointerEvents: open ? undefined : 'none', position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 296, padding: 16, boxSizing: 'border-box', background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', zIndex: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <NavBtn label="Previous month" onClick={() => page(-1)}>{'\u2190'}</NavBtn>
          <span id={headId} aria-live="polite" style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{MONTHS[m]} <span style={{ ...mono, color: 'var(--muted)' }}>{y}</span></span>
          <NavBtn label="Next month" onClick={() => page(1)}>{'\u2192'}</NavBtn>
        </div>
        {/* quiet: rows use display: contents so the grid semantics add no boxes to the 7-column layout */}
        <div key={y + '-' + m} role="grid" aria-labelledby={headId} onKeyDown={gridKey} className={paged ? 'q-anim-fade' : undefined} data-state={paged ? 'open' : undefined} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 2 }}>
          <div role="row" style={{ display: 'contents' }}>
          {heads.map((d, i) => <span key={'h' + i} role="columnheader" aria-label={DAY_NAMES[(i + weekStartsOn) % 7]} style={{ ...mono, fontSize: 10, color: 'var(--muted-2)', textAlign: 'center', paddingBottom: 6 }}>{d}</span>)}
          </div>
          {weeks.map((w, r) => <div key={'w' + r} role="row" style={{ display: 'contents' }}>{w.map((d, c) => {
            const i = r * 7 + c;
            if (!d) return <span key={'e' + i} role="gridcell" />;
            const isSel = same(d, cur), isToday = same(d, today), dis = off(d), k = d.getTime();
            return (
              <span key={k} role="gridcell" aria-selected={isSel} style={{ display: 'contents' }}>
              <button type="button" data-day={k} tabIndex={k === tabDay ? 0 : -1} aria-disabled={dis || undefined} aria-label={longFmt(d)} onClick={() => !dis && pick(d)} onMouseEnter={() => setHov(k)} onMouseLeave={() => setHov(null)}
                onFocus={() => { setHov(k); setFocus(d); }} onBlur={() => setHov(null)} aria-current={isToday ? 'date' : undefined}
                style={{ position: 'relative', height: 36, width: 36, justifySelf: 'center', borderRadius: 999, border: '1px solid ' + (hov === k && !isSel && !dis ? 'var(--ink)' : 'transparent'),
                  background: isSel ? 'var(--ink)' : 'transparent', color: isSel ? 'var(--paper)' : dis ? 'var(--muted-2)' : 'var(--ink)', cursor: dis ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontVariantNumeric: 'tabular-nums', textDecoration: dis ? 'line-through' : 'none', transition: 'border-color var(--dur-hover) var(--ease-soft)' }}>
                {d.getDate()}
                {isToday && <span aria-hidden="true" style={{ position: 'absolute', bottom: 4, left: '50%', marginLeft: -2, width: 4, height: 4, borderRadius: 999, background: 'var(--molten)' }} />}
              </button>
              </span>
            );
          })}</div>)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--rule-soft)', ...mono }}>
          <button type="button" disabled={off(today)} onClick={() => pick(today)} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: off(today) ? 'var(--muted-2)' : 'var(--ink)' }}>Today</button>
          <button type="button" onClick={() => pick(null)} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: 'var(--muted)' }}>Clear</button>
        </div>
      </div>}
      {(error || helperText) && <span id={hintId} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: error ? 'var(--molten)' : 'var(--muted)' }}>{error || helperText}</span>}
    </div>
  );
}

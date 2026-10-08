import React from 'react';

const SIZES = { sm: { h: 36, fs: 15, px: 12 }, md: { h: 48, fs: 17, px: 16 }, lg: { h: 56, fs: 19, px: 20 } };
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const strip = d => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate()) : null;
const same = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const defFmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function NavBtn({ children, onClick, label }) {
  const [h, setH] = React.useState(false);
  return <button type="button" aria-label={label} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
    style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid ' + (h ? 'var(--ink)' : 'var(--rule-soft)'), background: 'var(--paper)', cursor: 'pointer', color: 'var(--ink)', fontSize: 15, lineHeight: 1, transition: 'border-color var(--dur-hover) var(--ease-soft)' }}>{children}</button>;
}

export function DatePicker({ label, value, defaultValue, onChange, min, max, weekStartsOn = 0, format = defFmt, placeholder = 'Pick a date', size = 'md', disabled = false, helperText, error, style }) {
  const [inner, setInner] = React.useState(defaultValue || null);
  const cur = value !== undefined ? value : inner;
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState(() => { const b = cur || new Date(); return new Date(b.getFullYear(), b.getMonth(), 1); });
  const [hov, setHov] = React.useState(null);
  const ref = React.useRef(null);
  const sz = SIZES[size] || SIZES.md;
  const today = strip(new Date());
  const lo = strip(min), hi = strip(max);
  React.useEffect(() => {
    if (!open) return;
    const h = e => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const k = e => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [open]);
  const pick = d => { setInner(d); onChange && onChange(d); setOpen(false); };
  const y = view.getFullYear(), m = view.getMonth();
  const lead = (new Date(y, m, 1).getDay() - weekStartsOn + 7) % 7;
  const count = new Date(y, m + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => new Date(y, m, i + 1))];
  const heads = DAYS.slice(weekStartsOn).concat(DAYS.slice(0, weekStartsOn));
  const off = d => (lo && d < lo) || (hi && d > hi);
  const mono = { fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' };
  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', gap: 8, minWidth: 240, opacity: disabled ? 0.4 : 1, ...style }}>
      {label && <span style={{ ...mono, color: 'var(--muted)' }}>{label}</span>}
      <button type="button" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} onClick={() => { if (!open && cur) setView(new Date(cur.getFullYear(), cur.getMonth(), 1)); setOpen(!open); }}
        style={{ display: 'flex', alignItems: 'center', gap: 12, height: sz.h, padding: '0 ' + sz.px + 'px', boxSizing: 'border-box', width: '100%', textAlign: 'left', background: 'var(--paper)',
          border: '1px solid ' + (error ? 'var(--molten)' : open ? 'var(--ink)' : 'var(--rule-soft)'), borderRadius: 'var(--radius-md)', boxShadow: open ? 'var(--ring-focus)' : 'none', fontFamily: 'var(--font-sans)', fontSize: sz.fs,
          color: cur ? 'var(--ink)' : 'var(--muted-2)', cursor: disabled ? 'not-allowed' : 'pointer', outline: 'none', transition: 'border-color var(--dur-hover) var(--ease-soft)' }}>
        <span style={{ flex: 1 }}>{cur ? format(cur) : placeholder}</span>
        <span aria-hidden="true" style={{ ...mono, color: 'var(--muted)' }}>{cur ? String(cur.getDate()).padStart(2, '0') : '--'}</span>
      </button>
      {open && <div role="dialog" aria-label="Choose date" style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, width: 296, padding: 16, boxSizing: 'border-box', background: 'var(--paper)', border: '1px solid var(--rule-soft)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-2)', zIndex: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <NavBtn label="Previous month" onClick={() => setView(new Date(y, m - 1, 1))}>{'\u2190'}</NavBtn>
          <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{MONTHS[m]} <span style={{ ...mono, color: 'var(--muted)' }}>{y}</span></span>
          <NavBtn label="Next month" onClick={() => setView(new Date(y, m + 1, 1))}>{'\u2192'}</NavBtn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: 2 }}>
          {heads.map((d, i) => <span key={'h' + i} style={{ ...mono, fontSize: 10, color: 'var(--muted-2)', textAlign: 'center', paddingBottom: 6 }}>{d}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={'e' + i} />;
            const isSel = same(d, cur), isToday = same(d, today), dis = off(d), k = d.getTime();
            return (
              <button key={k} type="button" disabled={dis} onClick={() => pick(d)} onMouseEnter={() => setHov(k)} onMouseLeave={() => setHov(null)} aria-pressed={isSel} aria-current={isToday ? 'date' : undefined}
                style={{ position: 'relative', height: 36, width: 36, justifySelf: 'center', borderRadius: 999, border: '1px solid ' + (hov === k && !isSel && !dis ? 'var(--ink)' : 'transparent'),
                  background: isSel ? 'var(--ink)' : 'transparent', color: isSel ? 'var(--paper)' : dis ? 'var(--muted-2)' : 'var(--ink)', cursor: dis ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: 14, fontVariantNumeric: 'tabular-nums', textDecoration: dis ? 'line-through' : 'none', transition: 'border-color var(--dur-hover) var(--ease-soft)' }}>
                {d.getDate()}
                {isToday && <span aria-hidden="true" style={{ position: 'absolute', bottom: 4, left: '50%', marginLeft: -2, width: 4, height: 4, borderRadius: 999, background: 'var(--molten)' }} />}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--rule-soft)', ...mono }}>
          <button type="button" disabled={off(today)} onClick={() => pick(today)} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: off(today) ? 'var(--muted-2)' : 'var(--ink)' }}>Today</button>
          <button type="button" onClick={() => pick(null)} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: 'var(--muted)' }}>Clear</button>
        </div>
      </div>}
      {(error || helperText) && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: error ? 'var(--molten)' : 'var(--muted)' }}>{error || helperText}</span>}
    </div>
  );
}

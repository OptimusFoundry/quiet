import React from 'react';

const SIZES = { sm: { fs: 10, h: 28, px: 12 }, md: { fs: 11, h: 36, px: 16 }, lg: { fs: 12, h: 44, px: 20 } };

function Tab({ t, on, variant, sz, onPick, first }) {
  const [h, setH] = React.useState(false);
  const off = t.disabled;
  const base = { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 0, cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.4 : 1,
    fontFamily: 'var(--font-mono)', fontSize: sz.fs, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    transition: 'color var(--dur-hover) var(--ease-soft), border-color var(--dur-hover) var(--ease-soft), background var(--dur-hover) var(--ease-soft)' };
  const v = {
    line: { padding: '0 0 12px', marginBottom: -1, color: on ? 'var(--ink)' : h && !off ? 'var(--ink)' : 'var(--muted)', borderBottom: '1px solid ' + (on ? 'var(--ink)' : 'transparent') },
    enclosed: { height: sz.h, padding: '0 ' + sz.px + 'px', color: on ? 'var(--ink)' : 'var(--muted)', background: on ? 'var(--paper)' : 'transparent', borderRadius: 'var(--radius-sm)', boxShadow: on ? 'var(--shadow-1)' : 'none' },
    pill: { height: sz.h, padding: '0 ' + sz.px + 'px', borderRadius: 999, color: on ? 'var(--paper)' : 'var(--ink)', background: on ? 'var(--ink)' : h && !off ? 'var(--paper-2)' : 'transparent' },
  }[variant];
  return (
    <button role="tab" aria-selected={on} disabled={off} onClick={() => onPick(t.value)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ ...base, ...v }}>
      {t.icon && <span aria-hidden="true" style={{ display: 'inline-flex', fontSize: sz.fs + 3, textTransform: 'none' }}>{t.icon}</span>}
      {t.label}
      {t.count != null && <span style={{ color: on && variant === 'pill' ? 'var(--muted-2)' : 'var(--muted-2)' }}>{t.count}</span>}
    </button>
  );
}

export function Tabs({ tabs = [], value, defaultValue, onChange, variant = 'line', size = 'md', fullWidth = false, style }) {
  const list = tabs.map(t => typeof t === 'string' ? { value: t, label: t } : { ...t, label: t.label ?? t.value });
  const [inner, setInner] = React.useState(defaultValue ?? (list.find(t => !t.disabled) || {}).value);
  const cur = value ?? inner;
  const sz = SIZES[size] || SIZES.md;
  const pick = v => { setInner(v); onChange && onChange(v); };
  const wrap = {
    line: { display: 'flex', gap: 32, borderBottom: '1px solid var(--rule-soft)' },
    enclosed: { display: fullWidth ? 'flex' : 'inline-flex', gap: 4, padding: 4, background: 'var(--paper-2)', borderRadius: 'var(--radius-md)' },
    pill: { display: fullWidth ? 'flex' : 'inline-flex', gap: 4, padding: 4, border: '1px solid var(--rule-soft)', borderRadius: 999 },
  }[variant];
  return (
    <div role="tablist" style={{ ...wrap, ...style }}>
      {list.map((t, i) => <Tab key={t.value} t={t} first={i === 0} on={t.value === cur} variant={variant} sz={sz} onPick={pick} />)}
    </div>
  );
}

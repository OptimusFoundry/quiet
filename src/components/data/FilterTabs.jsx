import React from 'react';
import { rovingKeyDown } from '../../a11y/hooks';

function FT({ it, on, focusable, size, showCounts, onPick }) {
  const [h, setH] = React.useState(false);
  const sm = size === 'sm';
  return (
    <button type="button" role="radio" aria-checked={on} tabIndex={focusable ? 0 : -1} disabled={it.disabled} onClick={() => onPick(it.value)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onFocus={e => e.currentTarget.matches(':focus-visible') && setH(true)} onBlur={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: sm ? 28 : 36, padding: sm ? '0 12px' : '0 16px', borderRadius: 999, cursor: it.disabled ? 'not-allowed' : 'pointer', opacity: it.disabled ? 0.4 : 1,
        border: '1px solid ' + (on ? 'var(--ink)' : h ? 'var(--ink)' : 'var(--rule-soft)'), background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--paper)' : 'var(--ink)',
        fontFamily: 'var(--font-sans)', fontSize: sm ? 13 : 15, fontWeight: 500, whiteSpace: 'nowrap', transition: 'background var(--dur-enter) var(--ease-soft), color var(--dur-enter) var(--ease-soft), border-color var(--dur-hover) var(--ease-soft)' }}>
      {it.icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{it.icon}</span>}
      {it.label}
      {showCounts && it.count != null && <><span style={{ fontFamily: 'var(--font-mono)', fontSize: sm ? 10 : 11, color: on ? 'var(--muted-2)' : 'var(--muted)', transition: 'color var(--dur-enter) var(--ease-soft)' }}>{it.count}</span><span className="q-sr-only">{it.count === 1 ? ' item' : ' items'}</span></>}
    </button>
  );
}

export function FilterTabs({ items = [], value, defaultValue, onChange, size = 'md', showCounts = true, label = 'Filter', style }) {
  const list = items.map(i => typeof i === 'string' ? { value: i, label: i } : i);
  const [inner, setInner] = React.useState(defaultValue ?? (list[0] && list[0].value));
  const cur = value ?? inner;
  const pick = v => { setInner(v); onChange && onChange(v); };
  const stop = list.find(it => it.value === cur && !it.disabled) || list.find(it => !it.disabled);
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={rovingKeyDown('[role="radio"]', 'both', { activate: true })} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', ...style }}>
      {list.map(it => <FT key={it.value} it={it} on={it.value === cur} focusable={it === stop} size={size} showCounts={showCounts} onPick={pick} />)}
    </div>
  );
}

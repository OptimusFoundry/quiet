import React from 'react';
import { rovingKeyDown } from '../../a11y/hooks';
import './FilterTabs.scss';

function FT({ it, on, focusable, size, showCounts, onPick }) {
  return (
    <button type="button" role="radio" aria-checked={on} tabIndex={focusable ? 0 : -1} disabled={it.disabled} onClick={() => onPick(it.value)}
      className={'q-filter-tabs__tab' + (size === 'sm' ? ' q-filter-tabs__tab--sm' : '')}>
      {it.icon && <span aria-hidden="true" className="q-filter-tabs__icon">{it.icon}</span>}
      {it.label}
      {showCounts && it.count != null && <><span className="q-filter-tabs__count">{it.count}</span><span className="q-sr-only">{it.count === 1 ? ' item' : ' items'}</span></>}
    </button>
  );
}

export function FilterTabs({ items = [], value, defaultValue, onChange, size = 'md', showCounts = true, label = 'Filter', className, style }) {
  const list = items.map(i => typeof i === 'string' ? { value: i, label: i } : i);
  const [inner, setInner] = React.useState(defaultValue ?? (list[0] && list[0].value));
  const cur = value ?? inner;
  const pick = v => { setInner(v); onChange && onChange(v); };
  const stop = list.find(it => it.value === cur && !it.disabled) || list.find(it => !it.disabled);
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={rovingKeyDown('[role="radio"]', 'both', { activate: true })}
      className={['q-filter-tabs', className].filter(Boolean).join(' ')} style={style}>
      {list.map(it => <FT key={it.value} it={it} on={it.value === cur} focusable={it === stop} size={size} showCounts={showCounts} onPick={pick} />)}
    </div>
  );
}

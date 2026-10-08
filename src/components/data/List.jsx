import React from 'react';
import './List.scss';

const SIZES = ['sm', 'md', 'lg'];

function LI({ it, divided, first, i, animated }) {
  const interactive = !!(it.onClick || it.href) && !it.disabled;
  const El = it.href ? 'a' : it.onClick ? 'button' : 'div';
  const text = typeof it.trailing === 'string';
  const cls = ['q-list__item', divided && !first && 'q-list__item--divided', interactive && 'q-list__item--interactive',
    it.disabled && 'q-list__item--disabled', animated && 'q-list__item--animated'].filter(Boolean).join(' ');
  return (
    <div role="listitem" className="q-list__row">
    <El href={it.disabled ? undefined : it.href} type={El === 'button' ? 'button' : undefined} onClick={it.disabled ? undefined : it.onClick} disabled={El === 'button' ? it.disabled : undefined}
      aria-disabled={El === 'a' && it.disabled ? true : undefined} aria-current={it.selected || undefined}
      className={cls} style={animated ? { '--_i': i } : undefined}>
      {it.leading != null && <span className="q-list__leading">{it.leading}</span>}
      <span className="q-list__text">
        <span className="q-list__primary">{it.primary}</span>
        {it.secondary && <span className="q-list__secondary">{it.secondary}</span>}
      </span>
      {it.trailing != null && <span className={'q-list__trailing' + (text ? ' q-list__trailing--text' : '')}>{it.trailing}</span>}
      {interactive && it.trailing == null && <span aria-hidden="true" className="q-list__arrow">{'→'}</span>}
    </El>
    </div>
  );
}

export function List({ items, groups, size = 'md', divided = true, bordered = false, animated = false, className, style }) {
  const gs = groups || [{ items: items || [] }];
  const uid = React.useId();
  const cls = ['q-list', 'q-list--' + (SIZES.includes(size) ? size : 'md'), groups && 'q-list--grouped', bordered && 'q-list--bordered', className].filter(Boolean).join(' ');
  let n = 0;
  return (
    <div role={groups ? undefined : 'list'} className={cls} style={style}>
      {gs.map((g, gi) => (
        <div key={gi} role={groups ? 'list' : undefined} aria-labelledby={groups && g.label ? uid + gi : undefined} className="q-list__group">
          {g.label && <div id={uid + gi} className="q-list__label">{g.label}</div>}
          {g.items.map((it, i) => <LI key={it.id ?? i} it={it} divided={divided} first={i === 0 && !g.label} i={n++} animated={animated} />)}
        </div>
      ))}
    </div>
  );
}

import React from 'react';

export function Tag({ children, tone = 'default', size = 'md', icon, avatar, onRemove, selectable = false, selected, defaultSelected = false, onSelect, disabled = false, style }) {
  const [inner, setInner] = React.useState(defaultSelected);
  const [h, setH] = React.useState(false);
  const on = selected ?? inner;
  const fill = selectable && on;
  const ink = tone === 'ink' || fill || (selectable && h && !disabled);
  const sm = size === 'sm';
  const El = selectable ? 'button' : 'span';
  const click = () => { if (!selectable || disabled) return; setInner(!on); onSelect && onSelect(!on); };
  return (
    <El onClick={click} disabled={selectable ? disabled : undefined} aria-pressed={selectable ? on : undefined}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: sm ? 10 : 11, letterSpacing: '0.08em',
        textTransform: 'uppercase', lineHeight: 1, padding: sm ? '4px 10px' : '6px 12px', paddingLeft: avatar ? 4 : undefined, borderRadius: 'var(--radius-pill)',
        border: '1px solid ' + (ink ? 'var(--ink)' : 'var(--rule-soft)'), color: fill ? 'var(--paper)' : ink ? 'var(--ink)' : 'var(--muted)',
        background: fill ? 'var(--ink)' : 'transparent', cursor: selectable ? (disabled ? 'not-allowed' : 'pointer') : 'default', opacity: disabled ? 0.4 : 1,
        transition: 'background var(--dur-hover) var(--ease-soft), color var(--dur-hover) var(--ease-soft), border-color var(--dur-hover) var(--ease-soft)', ...style }}>
      {avatar}{icon && <span aria-hidden="true" style={{ display: 'inline-flex' }}>{icon}</span>}
      {children}
      {onRemove && <button type="button" aria-label="Remove" disabled={disabled} onClick={e => { e.stopPropagation(); onRemove(); }}
        style={{ background: 'none', border: 0, padding: 0, marginRight: -2, cursor: 'pointer', color: 'inherit', fontSize: 13, lineHeight: 1 }}>{'×'}</button>}
    </El>
  );
}

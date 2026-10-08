import React from 'react';

const SIZES = { sm: 14, md: 16, lg: 20 };

export function Checkbox({ label, description, checked, defaultChecked = false, indeterminate = false, onChange, disabled, error, size = 'md', style }) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const px = SIZES[size] || 16;
  const toggle = () => { if (disabled) return; setInner(!on); onChange && onChange(!on); };
  const filled = on || indeterminate;
  const edge = error ? 'var(--molten)' : 'var(--ink)';
  return (
    <label style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, fontSize: size === 'lg' ? 17 : size === 'sm' ? 13 : 15, color: 'var(--ink)', ...style }}>
      <span role="checkbox" aria-checked={indeterminate ? 'mixed' : on} aria-invalid={!!error || undefined} tabIndex={disabled ? -1 : 0} onClick={toggle}
        onKeyDown={e => e.key === ' ' && (e.preventDefault(), toggle())}
        style={{ width: px, height: px, flex: 'none', marginTop: label ? (size === 'lg' ? 3 : 2) : 0, display: 'grid', placeItems: 'center', boxSizing: 'border-box',
          border: '1px solid ' + edge, borderRadius: 'var(--radius-xs)', background: filled ? 'var(--ink)' : 'var(--paper)', color: 'var(--paper)', fontSize: px * 0.7, lineHeight: 1,
          transition: 'background var(--dur-hover) var(--ease-soft)' }}>
        {indeterminate ? '\u2212' : on ? '\u2713' : ''}
      </span>
      {(label || description || error) && <span onClick={toggle} style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1.4 }}>
        {label && <span>{label}</span>}
        {description && <span style={{ fontSize: 13, color: 'var(--muted)' }}>{description}</span>}
        {typeof error === 'string' && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--molten)' }}>{error}</span>}
      </span>}
    </label>
  );
}

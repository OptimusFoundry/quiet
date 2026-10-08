import React from 'react';

const SIZES = { sm: { w: 32, h: 20, k: 12 }, md: { w: 40, h: 24, k: 16 }, lg: { w: 48, h: 28, k: 20 } };

export function Switch({ label, description, checked, defaultChecked = false, onChange, disabled, size = 'md', labelPosition = 'right', 'aria-label': ariaLabel, style }) {
  const [inner, setInner] = React.useState(defaultChecked);
  const uid = React.useId();
  const on = checked ?? inner;
  const sz = SIZES[size] || SIZES.md;
  const pad = (sz.h - 2 - sz.k) / 2;
  const toggle = () => { if (disabled) return; setInner(!on); onChange && onChange(!on); };
  const text = (label || description) && (
    <span onClick={toggle} style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1.4, flex: labelPosition === 'left' ? 1 : undefined }}>
      {label && <span id={uid + 'l'}>{label}</span>}
      {description && <span id={uid + 'd'} style={{ fontSize: 13, color: 'var(--muted)' }}>{description}</span>}
    </span>
  );
  return (
    <label style={{ display: 'inline-flex', alignItems: description ? 'flex-start' : 'center', gap: 12, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, fontSize: size === 'lg' ? 17 : size === 'sm' ? 13 : 15, color: 'var(--ink)', ...style }}>
      {labelPosition === 'left' && text}
      <span role="switch" aria-checked={on} aria-labelledby={label ? uid + 'l' : undefined} aria-label={label ? undefined : ariaLabel} aria-describedby={description ? uid + 'd' : undefined} aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0} onClick={toggle} onKeyDown={e => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), toggle())}
        style={{ position: 'relative', width: sz.w, height: sz.h, flex: 'none', borderRadius: 999, border: '1px solid var(--ink)', boxSizing: 'border-box',
          background: on ? 'var(--ink)' : 'var(--paper)', transition: 'background var(--dur-hover) var(--ease-soft)' }}>
        <span style={{ position: 'absolute', top: pad, left: on ? sz.w - 2 - pad - sz.k : pad, width: sz.k, height: sz.k, borderRadius: 999,
          background: on ? 'var(--paper)' : 'var(--ink)', transition: 'left var(--dur-hover) var(--ease-soft), background var(--dur-hover) var(--ease-soft)' }} />
      </span>
      {labelPosition !== 'left' && text}
    </label>
  );
}

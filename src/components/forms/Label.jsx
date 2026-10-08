import React from 'react';

export function Label({ children, htmlFor, required = false, subText, badge, action, size = 'md', disabled = false, style }) {
  const fs = { sm: 10, md: 11, lg: 12 }[size] || 11;
  return (
    <div aria-disabled={disabled || undefined} style={{ display: 'flex', flexDirection: 'column', gap: 4, opacity: disabled ? 0.4 : 1, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <label htmlFor={htmlFor} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: fs, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>
          <span>{children}{required && <span aria-hidden="true" style={{ color: 'var(--molten)', marginLeft: 2 }}>*</span>}{required && <span className="q-sr-only"> (required)</span>}</span>
          {badge}
        </label>
        {action}
      </div>
      {subText && <span style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--muted)' }}>{subText}</span>}
    </div>
  );
}

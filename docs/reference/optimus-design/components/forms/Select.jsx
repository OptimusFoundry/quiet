import React from 'react';

export function Select({ label, options = [], style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>}
      <span style={{ position: 'relative', display: 'block' }}>
        <select {...rest} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ appearance: 'none', WebkitAppearance: 'none', width: '100%', fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--ink)',
            background: 'var(--paper)', padding: '12px 40px 12px 16px', borderRadius: 'var(--radius-md)', boxShadow: focus ? 'var(--ring-focus)' : 'none', outline: 'none', cursor: 'pointer',
            border: '1px solid ' + (focus ? 'var(--ink)' : 'var(--rule-soft)') }}>
          {options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span aria-hidden="true" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--muted)' }}>{'\u2193'}</span>
      </span>
    </label>
  );
}

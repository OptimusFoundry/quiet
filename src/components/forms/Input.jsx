import React from 'react';

export function Input({ label, hint, error, multiline = false, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const El = multiline ? 'textarea' : 'input';
  const uid = React.useId();
  const first = React.useRef(error ? 'e' : hint ? 'h' : '').current;
  const shown = error ? 'e' : hint ? 'h' : '';
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      {label && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{label}</span>}
      <El aria-invalid={!!error || undefined} aria-describedby={error || hint ? uid + 'h' : undefined} {...rest} onFocus={e => { setFocus(true); rest.onFocus && rest.onFocus(e); }} onBlur={e => { setFocus(false); rest.onBlur && rest.onBlur(e); }}
        style={{ fontFamily: 'var(--font-sans)', fontSize: 17, color: 'var(--ink)', background: 'var(--paper)', padding: '12px 16px',
          border: '1px solid ' + (error ? 'var(--molten)' : focus ? 'var(--ink)' : 'var(--rule-soft)'), borderRadius: 'var(--radius-md)', boxShadow: focus ? 'var(--ring-focus)' : 'none', outline: 'none',
          resize: multiline ? 'vertical' : undefined, minHeight: multiline ? 120 : undefined, transition: 'border-color var(--dur-hover) var(--ease-soft)' }} />
      {(error || hint) && <span key={shown} id={uid + 'h'} className={shown !== first ? 'q-anim-fade' : undefined} data-state="open" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.04em', color: error ? 'var(--molten)' : 'var(--muted)' }}>{error || hint}</span>}
    </label>
  );
}

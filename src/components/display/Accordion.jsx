import React from 'react';
import { rovingKeyDown } from '../../a11y/hooks';

function Row({ it, open, onToggle, first, headingLevel }) {
  const [h, setH] = React.useState(false);
  const off = it.disabled;
  const id = React.useId();
  const H = 'h' + headingLevel;
  return (
    <div style={{ borderTop: '1px solid ' + (first ? 'var(--ink)' : 'var(--rule-soft)') }}>
      <H style={{ margin: 0, font: 'inherit', letterSpacing: 'inherit' }}>
      <button type="button" id={id + 'h'} aria-expanded={open} aria-controls={id + 'p'} data-acc-header="" disabled={off} onClick={onToggle} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        onFocus={e => e.currentTarget.matches(':focus-visible') && setH(true)} onBlur={() => setH(false)}
        style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 0', background: 'none', border: 0, textAlign: 'left', cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.4 : 1 }}>
        {it.icon && <span aria-hidden="true" style={{ display: 'inline-flex', width: 20, justifyContent: 'center', color: 'var(--muted)', paddingTop: 2 }}>{it.icon}</span>}
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 600, fontSize: 19, letterSpacing: '-0.015em', lineHeight: 1.3, color: h && !off ? 'var(--molten)' : 'var(--ink)', transition: 'color var(--dur-hover) var(--ease-soft)' }}>{it.title}</span>
          {it.description && <span style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.45 }}>{it.description}</span>}
        </span>
        <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1.2, color: 'var(--ink)', transition: 'transform var(--dur-expand) var(--ease-soft)', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      </H>
      <div id={id + 'p'} role="region" aria-labelledby={id + 'h'} inert={!open} className="q-collapse" data-open={open}>
        <div className="q-collapse-inner">
          <div style={{ padding: '0 36px 24px ' + (it.icon ? 36 : 0) + 'px', fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: 720, textWrap: 'pretty' }}>{it.content}</div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ items = [], multiple = false, defaultExpanded = [], expanded, onChange, headingLevel = 3, style }) {
  const [inner, setInner] = React.useState(defaultExpanded);
  const cur = expanded ?? inner;
  const toggle = id => {
    const next = cur.includes(id) ? cur.filter(x => x !== id) : multiple ? [...cur, id] : [id];
    setInner(next); onChange && onChange(next);
  };
  const nav = rovingKeyDown('[data-acc-header]', 'vertical');
  return (
    <div onKeyDown={e => e.target.hasAttribute('data-acc-header') && nav(e)} style={{ borderBottom: '1px solid var(--rule-soft)', ...style }}>
      {items.map((it, i) => { const id = it.id ?? i; return <Row key={id} it={it} first={i === 0} open={cur.includes(id)} onToggle={() => toggle(id)} headingLevel={headingLevel} />; })}
    </div>
  );
}

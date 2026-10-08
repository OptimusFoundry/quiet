import React from 'react';

function Row({ it, open, onToggle, first }) {
  const [h, setH] = React.useState(false);
  const off = it.disabled;
  return (
    <div style={{ borderTop: '1px solid ' + (first ? 'var(--ink)' : 'var(--rule-soft)') }}>
      <button type="button" aria-expanded={open} disabled={off} onClick={onToggle} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 16, padding: '24px 0', background: 'none', border: 0, textAlign: 'left', cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.4 : 1 }}>
        {it.icon && <span aria-hidden="true" style={{ display: 'inline-flex', width: 20, justifyContent: 'center', color: 'var(--muted)', paddingTop: 2 }}>{it.icon}</span>}
        <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontWeight: 600, fontSize: 19, letterSpacing: '-0.015em', lineHeight: 1.3, color: h && !off ? 'var(--molten)' : 'var(--ink)', transition: 'color var(--dur-hover) var(--ease-soft)' }}>{it.title}</span>
          {it.description && <span style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.45 }}>{it.description}</span>}
        </span>
        <span aria-hidden="true" style={{ fontSize: 20, lineHeight: 1.2, color: 'var(--ink)', transition: 'transform 0.3s var(--ease-forge)', transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
      </button>
      <div style={{ display: 'grid', gridTemplateRows: open ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s var(--ease-forge)' }}>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ padding: '0 36px 24px ' + (it.icon ? 36 : 0) + 'px', fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)', maxWidth: 720, textWrap: 'pretty' }}>{it.content}</div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ items = [], multiple = false, defaultExpanded = [], expanded, onChange, style }) {
  const [inner, setInner] = React.useState(defaultExpanded);
  const cur = expanded ?? inner;
  const toggle = id => {
    const next = cur.includes(id) ? cur.filter(x => x !== id) : multiple ? [...cur, id] : [id];
    setInner(next); onChange && onChange(next);
  };
  return (
    <div style={{ borderBottom: '1px solid var(--rule-soft)', ...style }}>
      {items.map((it, i) => { const id = it.id ?? i; return <Row key={id} it={it} first={i === 0} open={cur.includes(id)} onToggle={() => toggle(id)} />; })}
    </div>
  );
}

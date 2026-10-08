import React from 'react';
import { rovingKeyDown } from '../../a11y/hooks';
import './Accordion.scss';

function Row({ it, open, onToggle, headingLevel }) {
  const id = React.useId();
  const H = 'h' + headingLevel;
  return (
    <div className="q-accordion__item">
      <H className="q-accordion__heading">
      <button type="button" id={id + 'h'} aria-expanded={open} aria-controls={id + 'p'} data-acc-header="" disabled={it.disabled} onClick={onToggle} className="q-accordion__header">
        {it.icon && <span aria-hidden="true" className="q-accordion__icon">{it.icon}</span>}
        <span className="q-accordion__text">
          <span className="q-accordion__title">{it.title}</span>
          {it.description && <span className="q-accordion__description">{it.description}</span>}
        </span>
        <span aria-hidden="true" className="q-accordion__toggle">+</span>
      </button>
      </H>
      <div id={id + 'p'} role="region" aria-labelledby={id + 'h'} inert={!open} className="q-collapse" data-open={open}>
        <div className="q-collapse-inner">
          <div className={'q-accordion__content' + (it.icon ? ' q-accordion__content--with-icon' : '')}>{it.content}</div>
        </div>
      </div>
    </div>
  );
}

export function Accordion({ items = [], multiple = false, defaultExpanded = [], expanded, onChange, headingLevel = 3, className, style }) {
  const [inner, setInner] = React.useState(defaultExpanded);
  const cur = expanded ?? inner;
  const toggle = id => {
    const next = cur.includes(id) ? cur.filter(x => x !== id) : multiple ? [...cur, id] : [id];
    setInner(next); onChange && onChange(next);
  };
  const nav = rovingKeyDown('[data-acc-header]', 'vertical');
  return (
    <div onKeyDown={e => e.target.hasAttribute('data-acc-header') && nav(e)} className={['q-accordion', className].filter(Boolean).join(' ')} style={style}>
      {items.map((it, i) => { const id = it.id ?? i; return <Row key={id} it={it} open={cur.includes(id)} onToggle={() => toggle(id)} headingLevel={headingLevel} />; })}
    </div>
  );
}

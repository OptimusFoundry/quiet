import React from 'react';
import './Rule.scss';

export function Rule({ tone = 'soft', variant = 'solid', orientation = 'horizontal', label, labelAlign = 'center', className, style }) {
  const name = typeof label === 'string' ? label : undefined;
  const vertical = orientation === 'vertical';
  const cls = ['q-rule', vertical && 'q-rule--vertical', label && 'q-rule--labelled', tone === 'ink' && 'q-rule--ink',
    (variant === 'dashed' || variant === 'dotted') && 'q-rule--' + variant, className].filter(Boolean).join(' ');
  const lab = label && <span className="q-rule__label">{label}</span>;
  if (vertical) {
    if (!label) return <span role="separator" aria-orientation="vertical" className={cls} style={style} />;
    return (
      <span role="separator" aria-orientation="vertical" aria-label={name} className={cls} style={style}>
        <span className="q-rule__line" />{lab}<span className="q-rule__line" />
      </span>
    );
  }
  if (!label) return <hr className={cls} style={style} />;
  return (
    <div role="separator" aria-label={name} className={cls} style={style}>
      {labelAlign !== 'start' && <span className="q-rule__line" />}{lab}<span className="q-rule__line" />
    </div>
  );
}

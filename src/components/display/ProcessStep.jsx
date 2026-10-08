import React from 'react';
import './ProcessStep.scss';

export function ProcessStep({ numeral, title, children, hot = false, headingLevel = 3, className, style }) {
  const H = 'h' + headingLevel;
  return (
    <div className={['q-process-step', hot && 'q-process-step--hot', className].filter(Boolean).join(' ')} style={style}>
      <div className="q-process-step__bar" />
      <div className="q-process-step__numeral">{numeral}</div>
      <H className="q-process-step__title">{title}</H>
      {children && <div className="q-process-step__body">{children}</div>}
    </div>
  );
}

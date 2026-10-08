import React from 'react';
import './Label.scss';

const SIZES = ['sm', 'md', 'lg'];

export function Label({ children, htmlFor, required = false, subText, badge, action, size = 'md', disabled = false, className, style }) {
  const cls = ['q-label', 'q-label--' + (SIZES.includes(size) ? size : 'md'), className].filter(Boolean).join(' ');
  return (
    <div aria-disabled={disabled || undefined} className={cls} style={style}>
      <div className="q-label__row">
        <label htmlFor={htmlFor} className="q-label__text">
          <span>{children}{required && <span aria-hidden="true" className="q-label__required">*</span>}{required && <span className="q-sr-only"> (required)</span>}</span>
          {badge}
        </label>
        {action}
      </div>
      {subText && <span className="q-label__sub">{subText}</span>}
    </div>
  );
}

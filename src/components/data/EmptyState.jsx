import React from 'react';
import './EmptyState.scss';

const SIZES = ['sm', 'md', 'lg'];

export function EmptyState({ icon = '/', eyebrow, title, accent, description, actions, size = 'md', bordered = false, align = 'center', headingLevel = 3, className, style }) {
  const H = 'h' + headingLevel;
  const cls = ['q-empty-state', 'q-empty-state--' + (SIZES.includes(size) ? size : 'md'), bordered && 'q-empty-state--bordered',
    align !== 'center' && 'q-empty-state--start', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      {icon && <span aria-hidden="true" className="q-empty-state__icon">{icon}</span>}
      {eyebrow && <span className="q-empty-state__eyebrow">{eyebrow}</span>}
      {title && <H className="q-empty-state__title">
        {title}{accent && <> <em>{accent}</em></>}<span aria-hidden="true" className="q-empty-state__dot">.</span></H>}
      {description && <p className="q-empty-state__description">{description}</p>}
      {actions && <div className="q-empty-state__actions">{actions}</div>}
    </div>
  );
}

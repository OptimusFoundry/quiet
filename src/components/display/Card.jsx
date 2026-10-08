import React from 'react';
import './Card.scss';

export function Card({ eyebrow, title, accent, children, meta, footer, href, onClick, className, style }) {
  const interactive = !!(href || onClick);
  const El = href ? 'a' : 'div';
  return (
    <El href={href} onClick={onClick}
      {...(!href && onClick ? { role: 'button', tabIndex: 0, onKeyDown: e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(e); } } } : {})}
      className={['q-card', interactive && 'q-card--interactive', className].filter(Boolean).join(' ')} style={style}>
      {eyebrow && <div className="q-card__eyebrow">{eyebrow}</div>}
      {title && <div className="q-card__title">
        {title}{accent && <> <em className="q-card__accent">{accent}</em></>}
      </div>}
      {children && <div className="q-card__body">{children}</div>}
      {(meta || footer) && <div className="q-card__footer">
        {meta && <div className="q-card__meta">{meta}</div>}
        {footer}
      </div>}
    </El>
  );
}

import React from 'react';
import { Eyebrow } from '../core/Eyebrow';
import { Headline } from '../core/Headline';
import './SectionHeader.scss';

// Headline only takes `style`, so the md title's type scale goes in as token references.

export function SectionHeader({ index, eyebrow, title, accent, description, actions, size = 'md', as = 'h2', className, style }) {
  const md = size === 'md';
  const right = description || actions;
  const cls = ['q-section-header', 'q-section-header--' + (md ? 'md' : 'sm'), right && 'q-section-header--split', className].filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      <div className="q-section-header__heading">
        {(eyebrow || index) && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
        <Headline size={md ? 'h3' : 'h4'} as={as} lead={title} accent={accent} className={md ? 'q-section-header__title q-section-header__title--md' : 'q-section-header__title'} />
      </div>
      {right && <div className="q-section-header__aside">
        {description && <p className="q-section-header__description">{description}</p>}
        {actions && <div className="q-section-header__actions">{actions}</div>}
      </div>}
    </div>
  );
}

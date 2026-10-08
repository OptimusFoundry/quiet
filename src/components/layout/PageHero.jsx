import React from 'react';
import { Eyebrow } from '../core/Eyebrow';
import { Headline } from '../core/Headline';
import './PageHero.scss';

// Headline only takes `style`, so the md title's type scale goes in as token references.

export function PageHero({ index, eyebrow, title, accent, after, description, actions, size = 'lg', ruled = true, as = 'h1', className, style }) {
  const lg = size === 'lg';
  const cls = ['q-page-hero', 'q-page-hero--' + (lg ? 'lg' : 'md'), ruled && 'q-page-hero--ruled', className].filter(Boolean).join(' ');
  return (
    <header className={cls} style={style}>
      {(eyebrow || index) && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
      <Headline size={lg ? 'h2' : 'h3'} as={as} lead={title} accent={accent} after={after} className={lg ? 'q-page-hero__title' : 'q-page-hero__title q-page-hero__title--md'} />
      {description && <p className="q-page-hero__description">{description}</p>}
      {actions && <div className="q-page-hero__actions">{actions}</div>}
    </header>
  );
}

import React from 'react';
import './Headline.scss';

const TAGS = { display: 'h1', h2: 'h2', h3: 'h3', h4: 'h4' };

export function Headline({ size = 'h2', as, lead, accent, after, period = true, moltenAccent = false, className, style }) {
  const Tag = as || TAGS[size];
  const cls = ['q-headline', TAGS[size] && 'q-headline--' + size, className].filter(Boolean).join(' ');
  return (
    <Tag className={cls} style={style}>
      {lead}{lead && accent ? ' ' : ''}
      {accent && <em className={['q-headline__accent', moltenAccent && 'q-headline__accent--molten'].filter(Boolean).join(' ')}>{accent}</em>}
      {after ? (accent ? ' ' : '') + after : ''}
      {period && <span className="q-headline__period">.</span>}
    </Tag>
  );
}

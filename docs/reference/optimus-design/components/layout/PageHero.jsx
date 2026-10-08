import React from 'react';
import { Eyebrow } from '../core/Eyebrow';
import { Headline } from '../core/Headline';

export function PageHero({ index, eyebrow, title, accent, after, description, actions, size = 'lg', ruled = true, style }) {
  const lg = size === 'lg';
  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: lg ? 24 : 16, padding: lg ? '96px 0 64px' : '48px 0 32px', borderBottom: ruled ? '1px solid var(--rule-soft)' : 'none', ...style }}>
      {(eyebrow || index) && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
      <Headline size={lg ? 'h2' : 'h3'} as="h1" lead={title} accent={accent} after={after} style={lg ? undefined : { fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 }} />
      {description && <p style={{ margin: 0, maxWidth: 640, fontSize: lg ? 19 : 17, lineHeight: 1.55, color: 'var(--ink-2)', textWrap: 'pretty' }}>{description}</p>}
      {actions && <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>{actions}</div>}
    </header>
  );
}

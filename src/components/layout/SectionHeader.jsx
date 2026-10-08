import React from 'react';
import { Eyebrow } from '../core/Eyebrow';
import { Headline } from '../core/Headline';

export function SectionHeader({ index, eyebrow, title, accent, description, actions, size = 'md', as = 'h2', style }) {
  const md = size === 'md';
  const right = description || actions;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: right ? 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))' : '1fr', gap: md ? 32 : 16, alignItems: 'end', paddingTop: md ? 32 : 16, borderTop: '1px solid var(--ink)', ...style }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: md ? 16 : 8 }}>
        {(eyebrow || index) && <Eyebrow index={index}>{eyebrow}</Eyebrow>}
        <Headline size={md ? 'h3' : 'h4'} as={as} lead={title} accent={accent} style={md ? { fontSize: 40, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1 } : undefined} />
      </div>
      {right && <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        {description && <p style={{ margin: 0, fontSize: md ? 17 : 15, lineHeight: 1.55, color: 'var(--ink-2)', maxWidth: 520, textWrap: 'pretty' }}>{description}</p>}
        {actions && <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>{actions}</div>}
      </div>}
    </div>
  );
}

import React from 'react';

const GLYPHS = {
  'arrow-right': '\u2192', 'arrow-left': '\u2190', 'arrow-up': '\u2191', 'arrow-down': '\u2193', expand: '\u2198', external: '\u2197',
  close: '\u00d7', check: '\u2713', plus: '+', minus: '\u2212', dot: '\u00b7', more: '\u2026', slash: '/', command: '\u2318', enter: '\u21b5',
  info: 'i', warning: '!', help: '?', first: '\u00ab', last: '\u00bb', sort: '\u2195', prev: '\u2039', next: '\u203a',
};
const SIZES = { xs: 10, sm: 12, md: 15, lg: 19, xl: 24, '2xl': 32 };
const COLORS = { default: 'var(--ink)', muted: 'var(--muted)', quiet: 'var(--muted-2)', primary: 'var(--molten)', success: 'var(--ink)', warning: 'var(--molten)', error: 'var(--molten)', inherit: 'inherit' };

export function Icon({ name = 'arrow-right', glyph, size = 'md', color = 'inherit', label, style }) {
  const px = typeof size === 'number' ? size : SIZES[size] || 15;
  return (
    <span role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '1em', height: '1em', flex: 'none',
        fontSize: px, lineHeight: 1, fontFamily: 'var(--font-sans)', fontWeight: 500, fontStyle: 'normal', color: COLORS[color] || color, ...style }}>
      {glyph ?? GLYPHS[name] ?? name}
    </span>
  );
}
Icon.glyphs = GLYPHS;

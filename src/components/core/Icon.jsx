import React from 'react';
import './Icon.scss';

const GLYPHS = {
  'arrow-right': '→', 'arrow-left': '←', 'arrow-up': '↑', 'arrow-down': '↓', expand: '↘', external: '↗',
  close: '×', check: '✓', plus: '+', minus: '−', dot: '·', more: '…', slash: '/', command: '⌘', enter: '↵',
  info: 'i', warning: '!', help: '?', first: '«', last: '»', sort: '↕', prev: '‹', next: '›',
};
const SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const COLORS = ['default', 'muted', 'quiet', 'primary', 'success', 'warning', 'error', 'inherit'];

export function Icon({ name = 'arrow-right', glyph, size = 'md', color = 'inherit', label, className, style }) {
  const numeric = typeof size === 'number';
  const knownColor = COLORS.includes(color);
  const vars = {};
  if (numeric) vars['--_size'] = size + 'px';
  if (!knownColor) vars['--_color'] = color;
  const cls = ['q-icon', numeric ? 'q-icon--custom-size' : 'q-icon--' + (SIZES.includes(size) ? size : 'md'),
    'q-icon--' + (knownColor ? color : 'custom-color'), className].filter(Boolean).join(' ');
  return (
    <span role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}
      className={cls} style={numeric || !knownColor ? { ...vars, ...style } : style}>
      {glyph ?? GLYPHS[name] ?? name}
    </span>
  );
}
Icon.glyphs = GLYPHS;

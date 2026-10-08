import React from 'react';

const SIZES = { xs: 12, sm: 13, md: 15, lg: 17, xl: 19, '2xl': 24, '3xl': 30, '4xl': 40, '5xl': 52 };
const COLORS = { default: 'var(--ink-2)', heading: 'var(--ink)', muted: 'var(--muted)', quiet: 'var(--muted-2)', primary: 'var(--molten)', success: 'var(--ink)', warning: 'var(--molten)', error: 'var(--molten)', inherit: 'inherit' };
const WEIGHTS = { normal: 400, medium: 500, semibold: 600, bold: 700 };
const HEADINGS = {
  1: { size: '5xl', weight: 'bold', tracking: '-0.04em', leading: 1 },
  2: { size: '4xl', weight: 'bold', tracking: '-0.035em', leading: 1.05 },
  3: { size: '3xl', weight: 'semibold', tracking: '-0.025em', leading: 1.1 },
  4: { size: '2xl', weight: 'semibold', tracking: '-0.02em', leading: 1.15 },
};

export function Text({ as, heading, size, weight, color, mono = false, italic = false, underline = false, strike = false, transform,
  truncate = false, lineClamp, align, children, style, ...rest }) {
  const hd = heading ? HEADINGS[heading] : null;
  const Tag = as || (hd ? 'h' + heading : 'p');
  const sz = size || (hd ? hd.size : mono ? 'xs' : 'md');
  const px = typeof sz === 'number' ? sz : SIZES[sz];
  const s = {
    margin: 0, fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)', fontSize: mono && !size ? 11 : px,
    fontWeight: WEIGHTS[weight || (hd ? hd.weight : 'normal')], color: COLORS[color || (hd ? 'heading' : mono ? 'muted' : 'default')] || color,
    lineHeight: hd ? hd.leading : px >= 24 ? 1.15 : 1.55, letterSpacing: mono ? '0.08em' : hd ? hd.tracking : px >= 24 ? '-0.02em' : undefined,
    textTransform: mono ? 'uppercase' : transform, fontStyle: italic ? 'italic' : undefined, textAlign: align,
    textDecoration: [underline && 'underline', strike && 'line-through'].filter(Boolean).join(' ') || undefined,
    textWrap: hd ? 'balance' : 'pretty',
    ...(truncate ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : {}),
    ...(lineClamp ? { display: '-webkit-box', WebkitLineClamp: lineClamp, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}),
    ...style,
  };
  return <Tag style={s} {...rest}>{children}</Tag>;
}

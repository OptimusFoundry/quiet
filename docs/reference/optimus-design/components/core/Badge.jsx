import React from 'react';

const SIZES = { sm: { fontSize: 11, h: 20, px: 8 }, md: { fontSize: 12, h: 24, px: 10 }, lg: { fontSize: 13, h: 28, px: 12 } };
const V = {
  default: { bg: 'var(--paper-2)', c: 'var(--ink)', b: 'var(--paper-2)' },
  primary: { bg: 'var(--ink)', c: 'var(--paper)', b: 'var(--ink)' },
  secondary: { bg: 'transparent', c: 'var(--muted)', b: 'var(--rule-soft)' },
  outline: { bg: 'transparent', c: 'var(--ink)', b: 'var(--ink)' },
  success: { bg: 'var(--paper-2)', c: 'var(--ink)', b: 'var(--paper-2)', dot: 'solid-ink' },
  warning: { bg: 'var(--paper-2)', c: 'var(--ink)', b: 'var(--paper-2)', dot: 'hollow' },
  error: { bg: 'var(--paper)', c: 'var(--ink)', b: 'var(--molten)', dot: 'molten' },
};

export function Badge({ variant = 'default', size = 'md', dot, leftIcon, rightIcon, count, max = 99, children, style }) {
  const v = V[variant] || V.default; const sz = SIZES[size] || SIZES.md;
  const showDot = dot ?? (!!v.dot && !leftIcon);
  const dotKind = v.dot || (variant === 'primary' ? 'paper' : 'solid-ink');
  const isCount = count != null;
  const label = isCount ? (count > max ? max + '+' : count) : children;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, height: sz.h, minWidth: isCount ? sz.h : undefined,
      padding: '0 ' + (isCount ? 6 : sz.px) + 'px', boxSizing: 'border-box', borderRadius: 999, border: '1px solid ' + v.b, background: v.bg, color: v.c,
      fontFamily: 'var(--font-sans)', fontSize: sz.fontSize, fontWeight: 600, lineHeight: 1, letterSpacing: '-0.005em', whiteSpace: 'nowrap',
      fontVariantNumeric: 'tabular-nums', ...style }}>
      {showDot && <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: 999, boxSizing: 'border-box', flex: 'none',
        background: dotKind === 'molten' ? 'var(--molten)' : dotKind === 'hollow' ? 'transparent' : dotKind === 'paper' ? 'var(--paper)' : 'var(--ink)',
        border: dotKind === 'hollow' ? '1px solid var(--molten)' : 'none' }} />}
      {leftIcon}{label}{rightIcon}
    </span>
  );
}

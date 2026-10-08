import React from 'react';
import { Spinner } from './Spinner';

const SIZES = { sm: { h: 32, px: 16, fontSize: 13, spin: 12 }, md: { h: 40, px: 24, fontSize: 15, spin: 14 }, lg: { h: 52, px: 32, fontSize: 17, spin: 16 } };

export function Button({ variant = 'primary', size = 'md', arrow = false, loading = false, disabled = false, fullWidth = false,
  leftIcon, rightIcon, icon, href, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const off = disabled || loading;
  const h = hover && !off;
  const sz = SIZES[size] || SIZES.md;
  const iconOnly = icon != null && children == null;
  const variants = {
    primary: { background: h ? 'var(--ink-2)' : 'var(--ink)', color: 'var(--paper)', border: '1px solid var(--ink)' },
    secondary: { background: h ? 'var(--paper-2)' : 'transparent', color: 'var(--ink)', border: '1px solid var(--ink)' },
    outline: { background: h ? 'var(--paper-2)' : 'transparent', color: 'var(--ink)', border: '1px solid ' + (h ? 'var(--ink)' : 'var(--rule-soft)') },
    ghost: { background: iconOnly && h ? 'var(--paper-2)' : 'transparent', color: h ? 'var(--molten)' : 'var(--ink)', border: '1px solid transparent' },
    destructive: { background: 'transparent', color: h ? 'var(--molten)' : 'var(--ink)', border: '1px solid ' + (h ? 'var(--molten)' : 'var(--ink)') },
  };
  const s = {
    display: fullWidth ? 'flex' : 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box',
    width: fullWidth ? '100%' : iconOnly ? sz.h : undefined, height: sz.h, padding: iconOnly || variant === 'ghost' ? 0 : '0 ' + sz.px + 'px',
    fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: sz.fontSize, letterSpacing: '-0.01em', lineHeight: 1,
    borderRadius: 'var(--radius-pill)', cursor: off ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, textDecoration: 'none', whiteSpace: 'nowrap',
    transition: 'background var(--dur-hover) var(--ease-soft), color var(--dur-hover) var(--ease-soft), border-color var(--dur-hover) var(--ease-soft)',
    ...variants[variant], ...style,
  };
  const inner = (
    <>
      {loading ? <Spinner size={sz.spin} tone={variant === 'primary' ? 'paper' : 'default'} label={null} /> : leftIcon}
      {iconOnly && !loading ? icon : null}
      {children}
      {rightIcon}
      {arrow && <span aria-hidden="true" style={{ display: 'inline-block', transition: 'transform var(--dur-hover) var(--ease-soft)', transform: h ? 'translateX(4px)' : 'none' }}>{'→'}</span>}
    </>
  );
  const common = { style: s, 'aria-busy': loading || undefined, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), ...rest };
  return href && !off
    ? <a href={href} {...common}>{inner}</a>
    : <button type="button" disabled={off} {...common}>{inner}</button>;
}

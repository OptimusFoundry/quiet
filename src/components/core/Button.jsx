import React from 'react';
import { Spinner } from './Spinner';

const SIZES = { sm: { h: 32, px: 16, fontSize: 13, spin: 12 }, md: { h: 40, px: 24, fontSize: 15, spin: 14 }, lg: { h: 52, px: 32, fontSize: 17, spin: 16 } };

export function Button({ variant = 'primary', size = 'md', arrow = false, loading = false, disabled = false, fullWidth = false,
  leftIcon, rightIcon, icon, href, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const off = disabled || loading;
  const h = (hover || focus) && !off;
  const sz = SIZES[size] || SIZES.md;
  const iconOnly = icon != null && children == null;
  const named = rest['aria-label'] || rest['aria-labelledby'] || rest.title;
  React.useEffect(() => {
    if (iconOnly && !named && (typeof process === 'undefined' || process.env.NODE_ENV !== 'production')) console.warn('Button: icon-only buttons need an aria-label.');
  }, [iconOnly, named]);
  // The spinner fades in when loading starts after mount; a button that mounts loading just shows it.
  const loadingAtMount = React.useRef(loading);
  if (!loading) loadingAtMount.current = false;
  const fadeSpin = loading && !loadingAtMount.current;
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
      {loading ? <Spinner size={sz.spin} tone={variant === 'primary' ? 'paper' : 'default'} label={null} aria-hidden="true"
        className={fadeSpin ? 'q-anim-fade' : undefined} data-state={fadeSpin ? 'open' : undefined} /> : leftIcon}
      {iconOnly && !loading ? icon : null}
      {children}
      {rightIcon}
      {arrow && <span aria-hidden="true" style={{ display: 'inline-block', transition: 'transform var(--dur-hover) var(--ease-soft)', transform: h ? 'translateX(4px)' : 'none' }}>{'\u2192'}</span>}
    </>
  );
  const common = { style: s, 'aria-busy': loading || undefined, ...rest,
    onMouseEnter: e => { setHover(true); rest.onMouseEnter && rest.onMouseEnter(e); },
    onMouseLeave: e => { setHover(false); rest.onMouseLeave && rest.onMouseLeave(e); },
    onFocus: e => { setFocus(e.currentTarget.matches(':focus-visible')); rest.onFocus && rest.onFocus(e); },
    onBlur: e => { setFocus(false); rest.onBlur && rest.onBlur(e); },
    onClick: e => { if (off) { e.preventDefault(); return; } rest.onClick && rest.onClick(e); } };
  return href && !off
    ? <a href={href} {...common}>{inner}</a>
    : <button type="button" disabled={disabled} aria-disabled={(loading && !disabled) || undefined} {...common}>{inner}</button>;
}

import React from 'react';
import { rovingKeyDown } from '../../a11y/hooks';

const SIZES = { sm: { fs: 10, h: 28, px: 12 }, md: { fs: 11, h: 36, px: 16 }, lg: { fs: 12, h: 44, px: 20 } };

function Tab({ t, on, variant, sz, onPick, first, focusable, sliding }) {
  const [h, setH] = React.useState(false);
  const off = t.disabled;
  // While the indicator slides, the active tab drops its own underline / raised segment so only one thing moves.
  const lit = on && !sliding;
  // The selected tab's underline / segment never fades itself in: the slide brings it, then it is simply there.
  const still = sliding || on ? { transition: 'color var(--dur-hover) var(--ease-soft)' } : null;
  const base = { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 0, cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.4 : 1,
    fontFamily: 'var(--font-mono)', fontSize: sz.fs, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap',
    transition: 'color var(--dur-hover) var(--ease-soft), border-color var(--dur-hover) var(--ease-soft), background var(--dur-hover) var(--ease-soft)', ...(sliding ? { position: 'relative' } : null) };
  const v = {
    line: { padding: '0 0 12px', marginBottom: -1, color: on ? 'var(--ink)' : h && !off ? 'var(--ink)' : 'var(--muted)', borderBottom: '1px solid ' + (lit ? 'var(--ink)' : 'transparent'), ...still },
    enclosed: { height: sz.h, padding: '0 ' + sz.px + 'px', color: on ? 'var(--ink)' : 'var(--muted)', background: lit ? 'var(--paper)' : 'transparent', borderRadius: 'var(--radius-sm)', boxShadow: lit ? 'var(--shadow-1)' : 'none', ...still },
    pill: { height: sz.h, padding: '0 ' + sz.px + 'px', borderRadius: 999, color: on ? 'var(--paper)' : 'var(--ink)', background: on ? 'var(--ink)' : h && !off ? 'var(--paper-2)' : 'transparent' },
  }[variant];
  return (
    <button type="button" role="tab" id={t.id} aria-selected={on} aria-controls={t.panelId} tabIndex={focusable ? 0 : -1} disabled={off} onClick={() => onPick(t.value)}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onFocus={e => e.currentTarget.matches(':focus-visible') && setH(true)} onBlur={() => setH(false)} style={{ ...base, ...v }}>
      {t.icon && <span aria-hidden="true" style={{ display: 'inline-flex', fontSize: sz.fs + 3, textTransform: 'none' }}>{t.icon}</span>}
      {t.label}
      {t.count != null && <span style={{ color: on && variant === 'pill' ? 'var(--muted-2)' : 'var(--muted-2)' }}>{t.count}</span>}
    </button>
  );
}

export function Tabs({ tabs = [], value, defaultValue, onChange, variant = 'line', size = 'md', fullWidth = false, label, 'aria-label': ariaLabel, style }) {
  const list = tabs.map(t => typeof t === 'string' ? { value: t, label: t } : { ...t, label: t.label ?? t.value });
  const [inner, setInner] = React.useState(defaultValue ?? (list.find(t => !t.disabled) || {}).value);
  const cur = value ?? inner;
  const sz = SIZES[size] || SIZES.md;
  const pick = v => { setInner(v); onChange && onChange(v); };
  // Sliding indicator: exists only between two selections (FLIP from the old tab to the new one), so the at-rest markup is untouched.
  const ref = React.useRef(null);
  const prev = React.useRef(cur);
  const [slide, setSlide] = React.useState(null);
  React.useLayoutEffect(() => {
    const from = prev.current; prev.current = cur;
    if (from === cur || variant === 'pill' || !ref.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = ref.current.querySelectorAll('[role="tab"]');
    const a = els[list.findIndex(t => t.value === from)], b = els[list.findIndex(t => t.value === cur)];
    if (!a || !b) return;
    const r = ref.current.getBoundingClientRect();
    const box = el => { const q = el.getBoundingClientRect(); return { left: q.left - r.left - ref.current.clientLeft, top: q.top - r.top - ref.current.clientTop, width: q.width, height: q.height }; };
    const to = box(b);
    setSlide({ ...box(a), go: false });
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setSlide({ ...to, go: true })));
    const end = setTimeout(() => setSlide(null), 400);
    return () => { cancelAnimationFrame(raf); clearTimeout(end); };
  }, [cur]);
  // Roving tabindex: only the selected tab (or the first enabled one) is in the tab order.
  let focusIdx = list.findIndex(t => t.value === cur && !t.disabled);
  if (focusIdx < 0) focusIdx = list.findIndex(t => !t.disabled);
  const wrap = {
    line: { display: 'flex', gap: 32, borderBottom: '1px solid var(--rule-soft)' },
    enclosed: { display: fullWidth ? 'flex' : 'inline-flex', gap: 4, padding: 4, background: 'var(--paper-2)', borderRadius: 'var(--radius-md)' },
    pill: { display: fullWidth ? 'flex' : 'inline-flex', gap: 4, padding: 4, border: '1px solid var(--rule-soft)', borderRadius: 999 },
  }[variant];
  const move = slide && slide.go ? 'left 0.28s var(--ease-soft), top 0.28s var(--ease-soft), width 0.28s var(--ease-soft)' : 'none';
  return (
    <div ref={ref} role="tablist" aria-label={ariaLabel ?? label} aria-orientation="horizontal" onKeyDown={rovingKeyDown('[role="tab"]', 'horizontal', { activate: true })}
      style={{ ...wrap, ...(slide ? { position: 'relative' } : null), ...style }}>
      {slide && <span aria-hidden="true" style={variant === 'line'
        ? { position: 'absolute', left: slide.left, width: slide.width, bottom: -1, height: 1, background: 'var(--ink)', transition: move }
        : { position: 'absolute', left: slide.left, top: slide.top, width: slide.width, height: slide.height, background: 'var(--paper)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-1)', transition: move }} />}
      {list.map((t, i) => <Tab key={t.value} t={t} first={i === 0} on={t.value === cur} focusable={i === focusIdx} sliding={!!slide} variant={variant} sz={sz} onPick={pick} />)}
    </div>
  );
}

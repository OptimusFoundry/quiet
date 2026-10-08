import React from 'react';
import { rovingKeyDown } from '../../a11y/hooks';
import './Tabs.scss';

const VARIANTS = ['line', 'enclosed', 'pill'];

function Tab({ t, on, focusable, onPick }) {
  return (
    <button type="button" role="tab" className="q-tabs__tab" id={t.id} aria-selected={on} aria-controls={t.panelId} tabIndex={focusable ? 0 : -1} disabled={t.disabled} onClick={() => onPick(t.value)}>
      {t.icon && <span aria-hidden="true" className="q-tabs__icon">{t.icon}</span>}
      {t.label}
      {t.count != null && <span className="q-tabs__count">{t.count}</span>}
    </button>
  );
}

export function Tabs({ tabs = [], value, defaultValue, onChange, variant = 'line', size = 'md', fullWidth = false, label, 'aria-label': ariaLabel, className, style }) {
  const list = tabs.map(t => typeof t === 'string' ? { value: t, label: t } : { ...t, label: t.label ?? t.value });
  const [inner, setInner] = React.useState(defaultValue ?? (list.find(t => !t.disabled) || {}).value);
  const cur = value ?? inner;
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
  const v = VARIANTS.includes(variant) ? variant : 'line';
  const cls = ['q-tabs', 'q-tabs--' + v, (size === 'sm' || size === 'lg') && 'q-tabs--' + size, fullWidth && 'q-tabs--full', className].filter(Boolean).join(' ');
  return (
    <div ref={ref} role="tablist" aria-label={ariaLabel ?? label} aria-orientation="horizontal" onKeyDown={rovingKeyDown('[role="tab"]', 'horizontal', { activate: true })}
      className={cls} data-sliding={slide ? '' : undefined} style={style}>
      {slide && <span aria-hidden="true" className="q-tabs__indicator" data-go={slide.go ? '' : undefined}
        style={{ '--_left': slide.left + 'px', '--_top': slide.top + 'px', '--_width': slide.width + 'px', '--_height': slide.height + 'px' }} />}
      {list.map((t, i) => <Tab key={t.value} t={t} on={t.value === cur} focusable={i === focusIdx} onPick={pick} />)}
    </div>
  );
}

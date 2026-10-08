import React from 'react';

function SideItem({ it, on, collapsed, compact, onPick }) {
  const [h, setH] = React.useState(false);
  const off = it.disabled;
  const El = it.href && !off ? 'a' : 'button';
  return (
    <El href={it.href} type={El === 'button' ? 'button' : undefined} disabled={El === 'button' ? off : undefined} title={collapsed ? (typeof it.label === 'string' ? it.label : undefined) : undefined}
      aria-current={on ? 'page' : undefined} onClick={e => { if (off) return; if (!it.href) e.preventDefault(); it.onClick && it.onClick(); onPick(it.value ?? it.label); }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', boxSizing: 'border-box', height: compact ? 32 : 40, padding: collapsed ? 0 : '0 12px',
        justifyContent: collapsed ? 'center' : 'flex-start', border: 0, borderRadius: 'var(--radius-sm)', textAlign: 'left', textDecoration: 'none', cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.4 : 1,
        background: on || (h && !off) ? 'var(--paper-2)' : 'transparent', color: on ? 'var(--ink)' : 'var(--ink-2)', fontFamily: 'var(--font-sans)', fontSize: compact ? 13 : 15,
        fontWeight: on ? 600 : 400, transition: 'background var(--dur-hover) var(--ease-soft)' }}>
      <span aria-hidden="true" style={{ width: 20, flex: 'none', display: 'inline-flex', justifyContent: 'center', color: on ? 'var(--ink)' : 'var(--muted)', fontFamily: it.icon ? 'inherit' : 'var(--font-mono)', fontSize: it.icon ? 15 : 10, letterSpacing: '0.04em' }}>
        {it.icon ?? (collapsed ? String(typeof it.label === 'string' ? it.label : '').slice(0, 2).toUpperCase() : null)}
      </span>
      {!collapsed && <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>}
      {!collapsed && it.badge != null && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{it.badge}</span>}
    </El>
  );
}

export function Sidebar({ items, groups, value, defaultValue, onChange, header, footer, collapsed, defaultCollapsed = false, onCollapsedChange, collapsible = false,
  compact = false, dividers = false, width = 240, collapsedWidth = 64, breakpoint, style }) {
  const [innerVal, setInnerVal] = React.useState(defaultValue);
  const [innerCol, setInnerCol] = React.useState(defaultCollapsed);
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    if (!breakpoint) return;
    const f = () => setNarrow(window.innerWidth < breakpoint);
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f);
  }, [breakpoint]);
  const isCol = collapsed ?? (innerCol || narrow);
  const cur = value ?? innerVal;
  const pick = v => { setInnerVal(v); onChange && onChange(v); };
  const toggle = () => { setInnerCol(!isCol); onCollapsedChange && onCollapsedChange(!isCol); };
  const gs = groups || [{ items: items || [] }];
  return (
    <nav aria-label="Sidebar" style={{ width: isCol ? collapsedWidth : width, flex: 'none', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24, padding: isCol ? '24px 8px' : '24px 16px',
      borderRight: '1px solid var(--rule-soft)', background: 'var(--paper)', transition: 'width 0.3s var(--ease-forge)', overflow: 'hidden', ...style }}>
      {(header || collapsible) && <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCol ? 'center' : 'space-between', gap: 8, minHeight: 32, padding: isCol ? 0 : '0 12px' }}>
        {!isCol && header}
        {collapsible && <button type="button" aria-label={isCol ? 'Expand sidebar' : 'Collapse sidebar'} onClick={toggle}
          style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid var(--rule-soft)', background: 'var(--paper)', cursor: 'pointer', color: 'var(--ink)', fontSize: 13, flex: 'none' }}>{isCol ? '\u2192' : '\u2190'}</button>}
      </div>}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: dividers ? 16 : 24 }}>
        {gs.map((g, gi) => (
          <div key={gi} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: dividers && gi > 0 ? 16 : 0, borderTop: dividers && gi > 0 ? '1px solid var(--rule-soft)' : 'none' }}>
            {g.label && !isCol && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-2)', padding: '0 12px 8px' }}>{g.label}</div>}
            {g.items.map((it, i) => <SideItem key={i} it={it} on={(it.value ?? it.label) === cur || it.active} collapsed={isCol} compact={compact} onPick={pick} />)}
          </div>
        ))}
      </div>
      {footer && !isCol && <div style={{ paddingTop: 16, borderTop: '1px solid var(--rule-soft)' }}>{footer}</div>}
    </nav>
  );
}

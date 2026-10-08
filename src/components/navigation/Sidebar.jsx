import React from 'react';

function SideItem({ it, on, collapsed, compact, onPick }) {
  const [h, setH] = React.useState(false);
  const off = it.disabled;
  const El = it.href && !off ? 'a' : 'button';
  return (
    <El href={it.href} type={El === 'button' ? 'button' : undefined} disabled={El === 'button' ? off : undefined} title={collapsed ? (typeof it.label === 'string' ? it.label : undefined) : undefined}
      aria-current={on ? 'page' : undefined} onClick={e => { if (off) return; if (!it.href) e.preventDefault(); it.onClick && it.onClick(); onPick(it.value ?? it.label); }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onFocus={e => e.currentTarget.matches(':focus-visible') && setH(true)} onBlur={() => setH(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', boxSizing: 'border-box', height: compact ? 32 : 40, padding: collapsed ? 0 : '0 12px',
        justifyContent: collapsed ? 'center' : 'flex-start', border: 0, borderRadius: 'var(--radius-sm)', textAlign: 'left', textDecoration: 'none', cursor: off ? 'not-allowed' : 'pointer', opacity: off ? 0.4 : 1,
        background: on || (h && !off) ? 'var(--paper-2)' : 'transparent', color: on ? 'var(--ink)' : 'var(--ink-2)', fontFamily: 'var(--font-sans)', fontSize: compact ? 13 : 15,
        fontWeight: on ? 600 : 400, transition: 'background var(--dur-hover) var(--ease-soft)' }}>
      <span aria-hidden="true" style={{ width: 20, flex: 'none', display: 'inline-flex', justifyContent: 'center', color: on ? 'var(--ink)' : 'var(--muted)', fontFamily: it.icon ? 'inherit' : 'var(--font-mono)', fontSize: it.icon ? 15 : 10, letterSpacing: '0.04em' }}>
        {it.icon ?? (collapsed ? String(typeof it.label === 'string' ? it.label : '').slice(0, 2).toUpperCase() : null)}
      </span>
      {!collapsed && <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>}
      {!collapsed && it.badge != null && <span aria-hidden="true" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>{it.badge}</span>}
      {/* Badges are announced as "Projects (14)" (or badgeLabel); in the rail the label is announced too. */}
      {(collapsed || it.badge != null) && <span className="q-sr-only">{collapsed ? it.label : null}{it.badge != null ? (collapsed ? ' (' : '(') + (it.badgeLabel ?? it.badge) + ')' : null}</span>}
    </El>
  );
}

export function Sidebar({ items, groups, value, defaultValue, onChange, header, footer, collapsed, defaultCollapsed = false, onCollapsedChange, collapsible = false,
  compact = false, dividers = false, width = 240, collapsedWidth = 64, breakpoint, label, 'aria-label': ariaLabel, style }) {
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
  const uid = React.useId();
  const [shut, setShut] = React.useState(() => gs.map(g => !!g.collapsible && g.defaultOpen === false));
  // Distinct default landmark name from the group labels, e.g. "Sidebar: Workspace, Account".
  const gl = gs.map(g => g.label).filter(l => typeof l === 'string');
  const name = ariaLabel ?? label ?? (gl.length ? 'Sidebar: ' + gl.join(', ') : 'Sidebar');
  return (
    <nav aria-label={name} style={{ width: isCol ? collapsedWidth : width, flex: 'none', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 24, padding: isCol ? '24px 8px' : '24px 16px',
      borderRight: '1px solid var(--rule-soft)', background: 'var(--paper)', transition: 'width 0.3s var(--ease-forge)', overflow: 'hidden', ...style }}>
      {(header || collapsible) && <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCol ? 'center' : 'space-between', gap: 8, minHeight: 32, padding: isCol ? 0 : '0 12px' }}>
        {!isCol && header}
        {collapsible && <button type="button" aria-label={isCol ? 'Expand sidebar' : 'Collapse sidebar'} onClick={toggle}
          style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid var(--rule-soft)', background: 'var(--paper)', cursor: 'pointer', color: 'var(--ink)', fontSize: 13, flex: 'none' }}>{isCol ? '\u2192' : '\u2190'}</button>}
      </div>}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: dividers ? 16 : 24 }}>
        {gs.map((g, gi) => (
          <div key={gi} style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: dividers && gi > 0 ? 16 : 0, borderTop: dividers && gi > 0 ? '1px solid var(--rule-soft)' : 'none' }}>
            {g.label && !isCol && (g.collapsible
              ? <button type="button" id={uid + 'g' + gi} aria-expanded={!shut[gi]} aria-controls={uid + 'l' + gi} onClick={() => setShut(sh => sh.map((x, j) => j === gi ? !x : x))}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-2)', padding: '0 12px 8px' }}>
                  {g.label}<span aria-hidden="true" style={{ display: 'inline-block', transform: shut[gi] ? 'rotate(-90deg)' : 'none', transition: 'transform var(--dur-hover) var(--ease-soft)' }}>{'\u25be'}</span></button>
              : <div id={uid + 'g' + gi} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted-2)', padding: '0 12px 8px' }}>{g.label}</div>)}
            {(() => { const ul = (
              <ul id={uid + 'l' + gi} aria-labelledby={g.label && !isCol ? uid + 'g' + gi : undefined} style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {g.items.map((it, i) => <li key={i}><SideItem it={it} on={(it.value ?? it.label) === cur || it.active} collapsed={isCol} compact={compact} onPick={pick} /></li>)}
              </ul>);
              return g.collapsible && !isCol
                ? <div className="q-collapse" data-open={String(!shut[gi])}><div className="q-collapse-inner" inert={shut[gi] ? true : undefined}>{ul}</div></div>
                : ul; })()}
          </div>
        ))}
      </div>
      {footer && !isCol && <div style={{ paddingTop: 16, borderTop: '1px solid var(--rule-soft)' }}>{footer}</div>}
    </nav>
  );
}

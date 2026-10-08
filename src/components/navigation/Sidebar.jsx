import React from 'react';
import './Sidebar.scss';

const px = v => (typeof v === 'number' ? v + 'px' : v);

function SideItem({ it, on, collapsed, onPick }) {
  const off = it.disabled;
  const El = it.href && !off ? 'a' : 'button';
  return (
    <El href={it.href} className="q-sidebar__item" type={El === 'button' ? 'button' : undefined} disabled={El === 'button' ? off : undefined} title={collapsed ? (typeof it.label === 'string' ? it.label : undefined) : undefined}
      aria-current={on ? 'page' : undefined} onClick={e => { if (off) return; if (!it.href) e.preventDefault(); it.onClick && it.onClick(); onPick(it.value ?? it.label); }}>
      <span aria-hidden="true" className={it.icon ? 'q-sidebar__icon' : 'q-sidebar__icon q-sidebar__icon--initials'}>
        {it.icon ?? (collapsed ? String(typeof it.label === 'string' ? it.label : '').slice(0, 2).toUpperCase() : null)}
      </span>
      {!collapsed && <span className="q-sidebar__label">{it.label}</span>}
      {!collapsed && it.badge != null && <span aria-hidden="true" className="q-sidebar__badge">{it.badge}</span>}
      {/* Badges are announced as "Projects (14)" (or badgeLabel); in the rail the label is announced too. */}
      {(collapsed || it.badge != null) && <span className="q-sr-only">{collapsed ? it.label : null}{it.badge != null ? (collapsed ? ' (' : '(') + (it.badgeLabel ?? it.badge) + ')' : null}</span>}
    </El>
  );
}

export function Sidebar({ items, groups, value, defaultValue, onChange, header, footer, collapsed, defaultCollapsed = false, onCollapsedChange, collapsible = false,
  compact = false, dividers = false, width, collapsedWidth, breakpoint, label, 'aria-label': ariaLabel, className, style }) {
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
    <nav aria-label={name} className={['q-sidebar', isCol && 'q-sidebar--collapsed', compact && 'q-sidebar--compact', dividers && 'q-sidebar--dividers', className].filter(Boolean).join(' ')}
      style={{ ...(width != null ? { '--_width': px(width) } : null), ...(collapsedWidth != null ? { '--_collapsed-width': px(collapsedWidth) } : null), ...style }}>
      {(header || collapsible) && <div className="q-sidebar__header">
        {!isCol && header}
        {collapsible && <button type="button" aria-label={isCol ? 'Expand sidebar' : 'Collapse sidebar'} onClick={toggle}
          className="q-sidebar__toggle">{isCol ? '\u2192' : '\u2190'}</button>}
      </div>}
      <div className="q-sidebar__body">
        {gs.map((g, gi) => (
          <div key={gi} className="q-sidebar__group">
            {g.label && !isCol && (g.collapsible
              ? <button type="button" id={uid + 'g' + gi} aria-expanded={!shut[gi]} aria-controls={uid + 'l' + gi} onClick={() => setShut(sh => sh.map((x, j) => j === gi ? !x : x))}
                  className="q-sidebar__group-label">
                  {g.label}<span aria-hidden="true" className="q-sidebar__chevron">{'\u25be'}</span></button>
              : <div id={uid + 'g' + gi} className="q-sidebar__group-label">{g.label}</div>)}
            {(() => { const ul = (
              <ul id={uid + 'l' + gi} aria-labelledby={g.label && !isCol ? uid + 'g' + gi : undefined} className="q-sidebar__list">
                {g.items.map((it, i) => <li key={i}><SideItem it={it} on={(it.value ?? it.label) === cur || it.active} collapsed={isCol} onPick={pick} /></li>)}
              </ul>);
              return g.collapsible && !isCol
                ? <div className="q-collapse" data-open={String(!shut[gi])}><div className="q-collapse-inner" inert={shut[gi] ? true : undefined}>{ul}</div></div>
                : ul; })()}
          </div>
        ))}
      </div>
      {footer && !isCol && <div className="q-sidebar__footer">{footer}</div>}
    </nav>
  );
}

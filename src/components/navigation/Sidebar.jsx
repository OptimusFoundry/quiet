import React from 'react';
import { useEscape, useFocusTrap, useModalBackground, usePresence } from '../../a11y/hooks';
import { useLinkElement } from '../../lib/link';
import './Sidebar.scss';

const px = v => (typeof v === 'number' ? v + 'px' : v);
const below = bp => typeof window !== 'undefined' && bp > 0 && window.innerWidth < bp;
const UNREGISTERED = { collapsed: false, drawer: false, toggle: null, panelId: undefined };

// quiet: shared state between a Sidebar and a SidebarTrigger that lives elsewhere (a top bar).
const SidebarContext = React.createContext(null);

export function SidebarProvider({ breakpoint = 768, open, defaultOpen = false, onOpenChange, children, _scoped = false }) {
  const [isMobile, setIsMobile] = React.useState(() => below(breakpoint));
  React.useEffect(() => {
    const f = () => setIsMobile(below(breakpoint));
    f(); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f);
  }, [breakpoint]);
  const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
  const [rail, register] = React.useState(UNREGISTERED);
  const drawer = isMobile && rail.drawer;
  const wanted = open ?? innerOpen;
  const isOpen = drawer && wanted;
  const change = React.useRef(onOpenChange);
  change.current = onOpenChange;
  const setOpen = React.useCallback(v => { setInnerOpen(v); change.current && change.current(v); }, []);
  // Growing past the breakpoint closes the drawer, so it doesn't reopen on the next shrink.
  const wantedRef = React.useRef(wanted);
  wantedRef.current = wanted;
  React.useEffect(() => { if (!isMobile && wantedRef.current) setOpen(false); }, [isMobile, setOpen]);
  const value = React.useMemo(() => ({
    isMobile, open: isOpen, setOpen, close: () => setOpen(false), collapsed: !drawer && rail.collapsed,
    toggle: () => (drawer ? setOpen(!isOpen) : rail.toggle && rail.toggle()),
    drawer, panelId: rail.panelId, register, scoped: _scoped,
  }), [isMobile, isOpen, setOpen, drawer, rail, _scoped]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar() must be used inside <SidebarProvider> or a <Sidebar>');
  const { isMobile, open, setOpen, close, toggle, collapsed } = ctx;
  return { isMobile, open, setOpen, close, toggle, collapsed };
}

export function SidebarTrigger({ 'aria-label': ariaLabel = 'Open navigation', children, className, style }) {
  const ctx = React.useContext(SidebarContext);
  if (!ctx || !ctx.drawer) return null;
  return (
    <button type="button" aria-label={ariaLabel} aria-expanded={ctx.open} aria-controls={ctx.open ? ctx.panelId : undefined} onClick={ctx.toggle}
      className={['q-sidebar-trigger', className].filter(Boolean).join(' ')} style={style}>
      {children ?? <span aria-hidden="true">{'≡'}</span>}
    </button>
  );
}

function SideItem({ it, on, collapsed, onPick }) {
  const off = it.disabled;
  const A = useLinkElement(it.href);
  const El = it.href && !off ? A : 'button';
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

// quiet: without a SidebarProvider the Sidebar scopes its own, so useSidebar() works in its slots.
export function Sidebar(props) {
  const ctx = React.useContext(SidebarContext);
  if (ctx) return <SidebarView {...props} />;
  return <SidebarProvider breakpoint={props.breakpoint ?? 0} _scoped><SidebarView {...props} /></SidebarProvider>;
}

function SidebarView({ items, groups, value, defaultValue, onChange, header, footer, collapsed, defaultCollapsed = false, onCollapsedChange, collapsible = false,
  compact = false, dividers = false, width, collapsedWidth, mobile, label, 'aria-label': ariaLabel, className, style }) {
  const ctx = React.useContext(SidebarContext);
  const mode = mobile ?? (ctx.scoped ? 'rail' : 'drawer');
  const drawer = mode === 'drawer' && ctx.isMobile;
  const [innerVal, setInnerVal] = React.useState(defaultValue);
  const [innerCol, setInnerCol] = React.useState(defaultCollapsed);
  const isCol = !drawer && (collapsed ?? (innerCol || ctx.isMobile));
  const cur = value ?? innerVal;
  const pick = v => { setInnerVal(v); onChange && onChange(v); if (drawer) ctx.close(); };
  const toggle = () => { setInnerCol(!isCol); onCollapsedChange && onCollapsedChange(!isCol); };
  const gs = groups || [{ items: items || [] }];
  const uid = React.useId();
  const [shut, setShut] = React.useState(() => gs.map(g => !!g.collapsible && g.defaultOpen === false));

  const toggleRef = React.useRef(toggle);
  toggleRef.current = toggle;
  const { register } = ctx;
  React.useLayoutEffect(() => { register({ collapsed: isCol, drawer: mode === 'drawer', toggle: () => toggleRef.current(), panelId: uid + 'panel' }); }, [register, isCol, mode, uid]);
  React.useEffect(() => () => register(UNREGISTERED), [register]);

  const { mounted, state } = usePresence(drawer && ctx.open, 160);
  const live = drawer && ctx.open && mounted;
  const wrap = React.useRef(null);
  const panel = React.useRef(null);
  // Same order as Drawer: the background is released before focus returns to the trigger.
  useModalBackground(wrap, live);
  useFocusTrap(panel, live);
  useEscape(live, ctx.close);

  // Distinct default landmark name from the group labels, e.g. "Sidebar: Workspace, Account".
  const gl = gs.map(g => g.label).filter(l => typeof l === 'string');
  const name = ariaLabel ?? label ?? (gl.length ? 'Sidebar: ' + gl.join(', ') : 'Sidebar');
  if (drawer && !mounted) return null;
  const nav = (
    <nav aria-label={name} className={['q-sidebar', isCol && 'q-sidebar--collapsed', compact && 'q-sidebar--compact', dividers && 'q-sidebar--dividers', drawer && 'q-sidebar--drawer', className].filter(Boolean).join(' ')}
      style={{ ...(width != null ? { '--_width': px(width) } : null), ...(collapsedWidth != null ? { '--_collapsed-width': px(collapsedWidth) } : null), ...style }}>
      {(header || collapsible || drawer) && <div className="q-sidebar__header">
        {!isCol && header}
        {drawer
          ? <button type="button" aria-label="Close navigation" onClick={ctx.close} className="q-sidebar__toggle">{'×'}</button>
          : collapsible && <button type="button" aria-label={isCol ? 'Expand sidebar' : 'Collapse sidebar'} onClick={toggle}
            className="q-sidebar__toggle">{isCol ? '→' : '←'}</button>}
      </div>}
      <div className="q-sidebar__body">
        {gs.map((g, gi) => (
          <div key={gi} className="q-sidebar__group">
            {g.label && !isCol && (g.collapsible
              ? <button type="button" id={uid + 'g' + gi} aria-expanded={!shut[gi]} aria-controls={uid + 'l' + gi} onClick={() => setShut(sh => sh.map((x, j) => j === gi ? !x : x))}
                  className="q-sidebar__group-label">
                  {g.label}<span aria-hidden="true" className="q-sidebar__chevron">{'▾'}</span></button>
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
  if (!drawer) return nav;
  return (
    <div ref={wrap} className="q-sidebar-drawer">
      <div className="q-sidebar-drawer__scrim q-anim-fade" data-state={state} onClick={ctx.close} aria-hidden="true" />
      <div ref={panel} id={uid + 'panel'} role="dialog" aria-modal="true" aria-label={name} tabIndex={-1}
        className="q-sidebar-drawer__panel q-anim-slide-left" data-state={state}>
        {nav}
      </div>
    </div>
  );
}

// App shell: 240 sidebar + 64 top bar + scrolling main. Density = app.
const APP_NAV = [
  { label: 'Workspace', items: [{ label: 'Overview', value: 'dashboard', icon: '\u00b7', href: 'dashboard.html' }, { label: 'Projects', value: 'projects', icon: '/', badge: 14, href: 'list-detail.html' }, { label: 'Builds', value: 'builds', icon: '\u2197', href: 'list-detail.html' }] },
  { label: 'Account', items: [{ label: 'Settings', value: 'settings', icon: '\u2026', href: 'settings.html' }, { label: 'Billing', value: 'billing', icon: '$', href: 'settings.html#billing' }] },
];
const APP_CMDS = [
  { label: 'Overview', group: 'Go to', onSelect: () => (location.href = 'dashboard.html') },
  { label: 'Projects', group: 'Go to', onSelect: () => (location.href = 'list-detail.html') },
  { label: 'Settings', group: 'Go to', onSelect: () => (location.href = 'settings.html') },
  { label: 'New project', group: 'Actions', shortcut: '\u2318N' },
  { label: 'Invite teammate', group: 'Actions' },
  { label: 'Anvil', description: 'Personal CRM \u00b7 iOS', group: 'Projects' },
  { label: 'Bellows', description: 'Event pipeline \u00b7 Go', group: 'Projects' },
];

// Two channels:
//   window.appToast({ title, variant, description, action })  — transient feedback on the user's own action.
//     Bottom-right of the screen, max 3, always auto-dismiss (4s; errors 6s). Never logged.
//     Anything that must stay until acknowledged is a notification, not a toast — persist: true reroutes to appNotify.
//   window.appNotify({ title, variant, description, action, at }) — system events (builds, billing, invites).
//     Logged to the notification centre drawer; unread count on the top-bar button. No pop-up.
function AppShell({ active, crumbs = [], children, mainPadding = true }) {
  const { Sidebar, Breadcrumb, Button, DropdownMenu, Avatar, Text, Wordmark, CommandPalette, GridOverlay, Toast, Drawer, Badge } = window.DS;
  const [pal, setPal] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [centre, setCentre] = React.useState(false);
  const dismiss = id => setToasts(t => t.filter(x => x.id !== id));
  const unread = notes.filter(n => !n.read).length;
  React.useEffect(() => {
    const uid = () => Date.now() + Math.random();
    window.appToast = t => {
      if (t.persist) return window.appNotify(t);
      const id = uid();
      setToasts(list => [...list, { ...t, id }].slice(-3));
      setTimeout(() => dismiss(id), t.variant === 'error' ? 6000 : 4000);
      return id;
    };
    window.appNotify = n => {
      const id = uid();
      setNotes(list => [{ ...n, id, read: !!n.read, at: n.at || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }, ...list]);
      return id;
    };
    return () => { delete window.appToast; delete window.appNotify; };
  }, []);
  const openCentre = () => setCentre(true);
  const closeCentre = () => { setCentre(false); setNotes(list => list.map(n => ({ ...n, read: true }))); };
  const MARK = { error: 'var(--molten)', warning: 'var(--molten)', success: 'var(--ink)', neutral: 'var(--ink)' };
  return (
    <div data-density="app" style={{ display: 'grid', gridTemplateColumns: 'var(--w-sidebar) minmax(0, 1fr)', height: '100vh', font: 'var(--font-body)', color: 'var(--ink-2)' }}>
      <Sidebar value={active} header={<Wordmark size="nav" />} groups={APP_NAV} style={{ height: '100vh' }}
        footer={<div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-inline)', padding: '0 12px' }}><Avatar name="Ada Lovelace" size="sm" /><div style={{ display: 'flex', flexDirection: 'column' }}><Text size="sm" color="heading" weight="medium">Ada Lovelace</Text><Text mono style={{ fontSize: 10 }}>Owner</Text></div></div>} />
      <div style={{ display: 'grid', gridTemplateRows: 'var(--h-topbar) minmax(0, 1fr)', minWidth: 0 }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 var(--space-page-x)', borderBottom: '1px solid var(--rule-soft)' }}>
          <Breadcrumb items={crumbs} style={{ flex: 1, minWidth: 0 }} />
          <Button variant="outline" size="sm" onClick={openCentre} rightIcon={unread ? <Badge size="sm" variant="error">{unread}</Badge> : null}>Notifications</Button>
          <Button variant="outline" size="sm" onClick={() => setPal(true)} rightIcon={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>{'\u2318K'}</span>}>Search</Button>
          <DropdownMenu size="sm" align="end" width={240} trigger={<span style={{ cursor: 'pointer', display: 'inline-flex' }}><Avatar name="Ada Lovelace" size="sm" /></span>}
            header={<div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}><Text size="sm" weight="semibold" color="heading">Ada Lovelace</Text><Text mono>ada@optimusfoundry.com</Text></div>}
            items={[{ label: 'Settings', onSelect: () => (location.href = 'settings.html') }, { label: 'Toggle grid', shortcut: 'Ctrl G' }, { divider: true }, { label: 'Sign out' }]} />
        </header>
        <main id="app-main" style={{ position: 'relative', overflowY: 'auto', minWidth: 0 }}>
          {mainPadding ? <div style={{ maxWidth: 'var(--grid-max)', margin: '0 auto', padding: 'var(--space-section) var(--space-page-x)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 'var(--space-block)' }}>{children}</div> : children}
        </main>
      </div>
      <Drawer open={centre} onClose={closeCentre} size="sm" title="Notifications" description={unread ? unread + ' unread' : 'All caught up'}
        footer={notes.length ? <><Button size="sm" variant="secondary" onClick={() => setNotes([])}>Clear all</Button><Button size="sm" onClick={closeCentre}>Mark all read</Button></> : null}>
        {notes.length === 0 ? <Text color="muted">Nothing here yet. Build results, invites and billing events land here.</Text> :
          <div style={{ display: 'flex', flexDirection: 'column', margin: '-16px 0' }}>
            {notes.map((n, i) => (
              <div key={n.id} style={{ display: 'grid', gridTemplateColumns: '12px minmax(0,1fr) auto', gap: 12, padding: '16px 0', borderTop: i ? '1px solid var(--rule-soft)' : 0, alignItems: 'start' }}>
                <span style={{ width: 8, height: 8, marginTop: 7, borderRadius: 999, background: n.read ? 'transparent' : (MARK[n.variant] || 'var(--molten)'), border: '1px solid ' + (MARK[n.variant] || 'var(--molten)'), boxSizing: 'border-box' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 500 : 600, fontSize: 15, lineHeight: 1.35, color: 'var(--ink)' }}>{n.title}</div>
                  {n.description && <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)' }}>{n.description}</div>}
                  {n.action && <div style={{ marginTop: 4 }}>{n.action}</div>}
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', paddingTop: 3 }}>{n.at}</span>
              </div>
            ))}
          </div>}
      </Drawer>
      <div aria-live="polite" style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 200, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', pointerEvents: 'none' }}>
        {toasts.map(t => <Toast key={t.id} title={t.title} description={t.description} meta={t.meta} variant={t.variant} action={t.action} onClose={() => dismiss(t.id)}
          style={{ pointerEvents: 'auto', animation: 'appToastIn .25s ease-out' }} />)}
      </div>
      <CommandPalette open={pal} onOpen={() => setPal(true)} onClose={() => setPal(false)} items={APP_CMDS} />
      <GridOverlay offsetLeft={240} />
      <style>{'@keyframes appToastIn{from{opacity:0}to{opacity:1}}'}</style>
    </div>
  );
}
window.AppShell = AppShell;

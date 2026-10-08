Primary navigation for app surfaces (dashboards, settings).
```jsx
<Sidebar header={<Wordmark size="nav" />} collapsible defaultValue="Overview" groups={[
  { label: 'Workspace', items: [{ label: 'Overview' }, { label: 'Projects', badge: 14 }, { label: 'Builds' }] },
  { label: 'Account', items: [{ label: 'Billing' }, { label: 'Team' }] },
]} />
```
- Without icons, the collapsed rail shows two-letter mono abbreviations.
- Active = paper-2 row + 600 weight. No accent bars.

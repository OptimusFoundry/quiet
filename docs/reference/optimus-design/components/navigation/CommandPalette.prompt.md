Global jump-to and actions in app surfaces.
```jsx
<CommandPalette open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} items={[
  { label: 'New project', group: 'Actions', shortcut: '⌘N' },
  { label: 'Anvil', description: 'Personal CRM · iOS', group: 'Projects' },
]} />
```
- Results filter on label, description and group.
- Empty state says the literal thing: "Nothing matches."

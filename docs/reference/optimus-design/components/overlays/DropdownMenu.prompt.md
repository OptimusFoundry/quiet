Overflow menus (…), account menus, file menus, right-click menus.
```jsx
<DropdownMenu align="end" trigger={<Button variant="ghost" icon="…" aria-label="More" />} items={[
  { label: 'Rename', shortcut: '⌘R' },
  { label: 'Duplicate', shortcut: '⌘D' },
  { divider: true },
  { label: 'Delete', danger: true },
]} />
```
- Danger items heat to molten on hover; they are never red-filled.
- Checkbox items keep the menu open.

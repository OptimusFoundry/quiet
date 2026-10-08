Location within nested pages.
```jsx
<Breadcrumb items={[{ label: 'Studio', href: '/' }, { label: 'Work', href: '/work' }, { label: 'Anvil' }]} />
<Breadcrumb maxItems={3} separator={'·'} items={[...]} />
```
- Last item is the current page — ink, not a link.

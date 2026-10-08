Outer structure of app pages and dashboards.
```jsx
<PageShell layout="sidebar" header={<PageHero size="md" title="Settings" />}>
  <Sidebar items={…} />
  <div>…</div>
</PageShell>
```
- Columns stack by container width (ResizeObserver), not viewport.

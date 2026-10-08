Place blocks on the 12-column grid.
```jsx
<Grid columns={12} gap="var(--grid-gutter)">
  <Col span={3}><StatCard … /></Col> ×4
  <Col span={8}><Table … /></Col>
  <Col span={4}><List … /></Col>
</Grid>
```
- Allowed spans on app pages: 3 · 4 · 6 · 8 · 9 · 12. Section heads: 5 + 6 starting at 7.
- Responsive by the Grid's own width (not the viewport): under 720 every Col spans 12; 720–960 spans under 4 become 6. Override with spanMd / spanSm.

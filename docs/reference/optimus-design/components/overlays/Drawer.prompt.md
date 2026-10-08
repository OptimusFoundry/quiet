Filters, record details, secondary editing without leaving the page.
```jsx
<Drawer open={open} onClose={close} title="Filter" accent="projects" footer={<><Button variant="secondary">Reset</Button><Button>Apply</Button></>}>
  <Checkbox label="Live only" />
</Drawer>
```
- Header and footer are separated by soft hairlines; the body scrolls.

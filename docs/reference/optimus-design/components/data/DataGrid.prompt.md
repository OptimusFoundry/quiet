Full data views — builds, invoices, members (this is also the DataTable).
```jsx
<DataGrid title="Builds" searchable selectable pageSize={8} columns={cols} data={builds}
  actions={<Button size="sm" arrow>New build</Button>} emptyDescription="Builds appear after the first cast." />
```
- Footer shows a mono "1–8 of 42" range beside the pager.

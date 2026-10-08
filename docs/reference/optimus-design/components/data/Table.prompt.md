Tabular data — invoices, builds, members. For pagination + search + empty state use DataGrid.
```jsx
<Table selectable defaultSort={{ key: 'amount', dir: 'desc' }} columns={[
  { key: 'name', header: 'Project', sortable: true },
  { key: 'status', header: 'Status', render: r => <Badge variant={r.status === 'Paid' ? 'success' : 'warning'}>{r.status}</Badge> },
  { key: 'amount', header: 'Amount', align: 'right', sortable: true, render: r => '$' + r.amount.toLocaleString() },
]} data={rows} />
```
- Right-align numbers; they render tabular.
- First column is ink; the rest ink-2.

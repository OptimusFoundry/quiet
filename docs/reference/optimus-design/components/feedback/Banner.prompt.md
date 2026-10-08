System-wide notices — maintenance, billing, cookies, trial ending.
```jsx
<Banner title="Scheduled maintenance." >Sunday 02:00–03:00 EST. Reads stay up.</Banner>
<Banner variant="ink" status="warning" title="Trial ends in 3 days." action={<Button size="sm" variant="secondary" style={{ color: 'var(--paper)', borderColor: 'var(--paper)' }}>Pick a plan</Button>} />
<Banner variant="outline" title="We use one cookie." dismissible={false} action={<Button size="sm">Fine</Button>} />
```
- One banner at a time. Stack only non-dismissible ones, ordered by severity.
- The ink strip is the only ink-filled surface outside buttons; keep it one line.

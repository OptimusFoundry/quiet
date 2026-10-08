Team members, recent activity, settings rows, the site's hairline project lists.
```jsx
<List items={[
  { primary: 'Sjocamp', secondary: 'Booking for summer camps', trailing: <StatusDot status="live" /> },
  { primary: 'Meerkat', secondary: 'Agentic QA', trailing: <StatusDot status="prototype" />, href: '#' },
]} />
```
- String trailing renders as mono caps metadata.
- Group headers sit on an ink rule.

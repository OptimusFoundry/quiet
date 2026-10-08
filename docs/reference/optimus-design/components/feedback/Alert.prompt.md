Messages tied to a page or form section.
```jsx
<Alert title="Brief received.">We reply within two days.</Alert>
<Alert variant="success" title="Manual v1.2 stamped." />
<Alert variant="warning" title="Card expires in 9 days." action={<ArrowLink href="#">Update card</ArrowLink>} />
<Alert variant="error" title="Deploy failed." onDismiss={() => {}}>Postgres refused the migration. Nothing shipped.</Alert>
```
- Status: info = soft hairline · success = ink hairline ✓ · warning = molten ! · error = molten hairline + molten !.
- No left accent bars, no tinted fills.
- Titles end with a period.

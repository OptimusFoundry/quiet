Labels any control. TextField, TextArea, Dropdown etc. render it for you.
```jsx
<Label htmlFor="email" required>Email</Label>
<Label subText="Shown on invoices" badge={<Badge size="sm">Optional</Badge>}>Company</Label>
<Label action={<Link size="sm" variant="muted">Forgot?</Link>}>Password</Label>
```
- The required asterisk is one of the few places molten appears in forms.

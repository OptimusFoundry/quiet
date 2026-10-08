Divides sections, list rows, toolbars. Hairlines before any shadow.
```jsx
<Rule />
<Rule tone="ink" />
<Rule label="Or continue with" />
<Rule variant="dashed" />
<div style={{ display: 'flex', gap: 16 }}>A<Rule orientation="vertical" />B</div>
```
- Ink for section tops and emphasis; soft for dividers.
- Dashed is reserved for placeholders and drop zones.

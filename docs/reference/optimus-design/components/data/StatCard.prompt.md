KPIs on dashboards. For marketing numbers ("14 pieces shipped") use Stat.
```jsx
<StatCard label="MRR" value={48200} format={v => '$' + Math.round(v).toLocaleString()} delta={12.4} period="vs Sep" animate />
<StatCard label="Churn" value="2.1%" delta={-0.3} variant="filled" />
```
- Down trends mark the glyph molten — the number itself stays ink.
- One count-up per screen.

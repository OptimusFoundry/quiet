Pick a single date — deadlines, launch dates, ranges by pairing two.
```jsx
<DatePicker label="Launch" />
<DatePicker label="Kick-off" min={new Date()} weekStartsOn={1} />
<DatePicker label="Due" format={d => d.toISOString().slice(0, 10)} />
```
- Out-of-range days are struck through.
- Esc or outside click closes.

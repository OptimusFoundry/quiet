Continuous values — budgets, volumes, thresholds.
```jsx
<Slider label="Budget" defaultValue={40} formatValue={v => v + 'k'} />
<Slider label="Retention days" min={7} max={90} step={7} defaultValue={30} />
```
- Arrow keys step; PageUp/Down ×10; Home/End jump.
- The focus ring is a hairline offset, not a glow.

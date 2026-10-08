Wrap custom or native controls that don't render their own label (Dropdown, Slider, a Checkbox group, a native <select>).
```jsx
<FormField label="Practice" helperText="Pick the closest fit.">
  <Dropdown options={['Full-stack apps', 'iOS apps']} />
</FormField>
<FormField label="Seats" required error="At least one seat.">
  <Stepper min={1} />
</FormField>
```
- TextField and TextArea already include this — don't double-wrap.

Choose one from a list when options need descriptions or icons. Plain lists can use native Select.
```jsx
<Dropdown label="Practice" placeholder="Pick one" options={[
  { value: 'web', label: 'Full-stack apps', description: 'Go, Postgres, React' },
  { value: 'ios', label: 'iOS apps', description: 'Swift, SwiftUI' },
  { divider: true },
  { value: 'ds', label: 'Design systems', disabled: true },
]} />
```
- Menus are rounded (--radius-lg) with a soft hairline and --shadow-2; rows are inset with --radius-sm highlights.
- Selected row shows ✓; hover row is paper-2.

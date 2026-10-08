Checkout, onboarding, multi-page forms. For the studio's own Brief → Cast → Temper → Stamp story use ProcessStep.
```jsx
<StepIndicator current={1} steps={[{ label: 'Brief' }, { label: 'Cast' }, { label: 'Temper' }, { label: 'Stamp' }]} />
<StepIndicator orientation="vertical" current={2} steps={[{ label: 'Account', description: 'Email and password' }, { label: 'Billing', status: 'error' }, { label: 'Review' }]} />
```
- Roman numerals for process steps, zero-padded arabic for transactional flows.

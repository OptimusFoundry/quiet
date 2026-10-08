Tab panels, route changes, wizard steps.
```jsx
<Tabs value={tab} onChange={setTab} tabs={['Profile', 'Billing']} />
<PageTransition transitionKey={tab} variant="slideUp">{panels[tab]}</PageTransition>
```
- Enter only — no exit choreography. Ease-in-out, never a bounce.
- Skipped entirely under reduced motion.

Confirmation after an action. Stack bottom-right, 8px apart, auto-dismiss ~4s.
```jsx
<Toast title="Brief received." meta="We reply within two days" onClose={close} />
<Toast variant="success" title="Changes saved." />
<Toast variant="error" title="Payment failed." description="The card was declined." action={<ArrowLink href="#">Update card</ArrowLink>} onClose={close} />
```
- No slide-in bounce — appear with a 0.25s opacity fade if animating.

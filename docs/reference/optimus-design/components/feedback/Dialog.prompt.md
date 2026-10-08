The Modal. Focused tasks and confirmations.
```jsx
<Dialog open={open} onClose={close} eyebrow="05 Get in touch" title="Commission a" accent="piece"
  actions={<><Button variant="secondary" onClick={close}>Cancel</Button><Button arrow>Send brief</Button></>}>…</Dialog>
<Dialog open size="sm" icon="warning" title="Delete Anvil" actions={<><Button variant="secondary">Keep it</Button><Button variant="destructive">Delete</Button></>}>
  This removes 14 builds. It can't be undone.
</Dialog>
```
- 0.2s linear fade on open; nothing under reduced motion.
- Destructive confirmations name the literal consequence.

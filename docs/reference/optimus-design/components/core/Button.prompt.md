Pill-shaped action button — primary calls to action and secondary actions. With href it is the LinkButton.
```jsx
<Button arrow>Start a project</Button>
<Button variant="secondary">Commission a piece</Button>
<Button variant="ghost" arrow>See the work</Button>
<Button variant="destructive">Delete project</Button>
<Button loading>Saving</Button>
<Button icon={<Icon name="plus" />} aria-label="Add" variant="outline" />
<Button href="/manual.pdf" variant="secondary" rightIcon={<Icon name="arrow-down" />}>Download</Button>
```
- primary ink fill · secondary 1px ink · outline 1px soft hairline · ghost text only · destructive ink outline that heats to molten on hover.
- One primary per surface. Never fill a button with molten.
- Press: no shrink, no bounce.
